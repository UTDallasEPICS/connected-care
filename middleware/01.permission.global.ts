import { defineNuxtRouteMiddleware } from "nuxt/app";
import { pageAccessMap, AccessPermission } from "~/types/permissions"; // <-- Import AccessPermission

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userId = useCookie("userId");
	const accessCookie = useCookie("AccessPermission");
	const permissions = accessCookie.value;

	console.log(
		"Attempting to navigating\nfrom: " +
			from.path +
			", to: " +
			to.path +
			"\nRoute name: '" +
			to.name +
			"'"
	);

	// TODO, handle when navigating back to index page while logged in
	if (to.path == "/") {
		console.log("Navigation authorized");
		return;
	}

	// page does not exist in pageAccessMap
	if (!pageAccessMap[to.name]) {
		console.log("Route not found in pageAccessMap. to.name:", to.name);
		console.log("pageAccessMap keys:", Object.keys(pageAccessMap));
		if (!from.path || to.path == from.path) {
			console.log("Unknown path, navigating to index");
			return navigateTo("/");
		} else {
			console.log("Unknown path, returning to: " + from.path);
			return abortNavigation();
		}
	}

	// Get required permission for this route
	const requiredAccessPermission: string = pageAccessMap[to.name];

	// Allow PUBLIC routes without authentication
	if (requiredAccessPermission === AccessPermission.PUBLIC) {
		console.log("Public route, navigation authorized");
		return;
	}

	// For non-public routes, check if user has permission
	if (
		!(
			permissions &&
			typeof permissions === "object" &&
			permissions[requiredAccessPermission]
		)
	) {
		if (!from.path || to.path == from.path) {
			console.log("Unauthorized path, navigating to index");
			return navigateTo("/");
		} else {
			console.log("Unauthorized path, returning to: " + from.path);
			return abortNavigation();
		}
	}

	// enforce patient can only view their own profile
	if (to.name === "myProfile-id" && to.params.id !== userId.value) {
		if (!from.path || to.path == from.path) {
			console.log("Unauthorized path, navigating to index");
			return navigateTo("/");
		} else {
			console.log("Unauthorized path, returning to: " + from.path);
			return abortNavigation();
		}
	}

	// enforce parent can only view their own children's profiles
	if (to.name === "childProfile-id") {
		// fetch children
		const childIds = await $fetch(
			`/api/parent/childrenIds?pId=${userId.value}`
		);
		if (!childIds.includes(to.params.id)) {
			if (!from.path || to.path == from.path) {
				console.log("Unauthorized path, navigating to index");
				return navigateTo("/");
			} else {
				console.log("Unauthorized path, returning to: " + from.path);
				return abortNavigation();
			}
		}
	}
	console.log("Navigation authorized");
});
