export default defineEventHandler(async (event) => {
	if (event.context.user) {
		setCookie(event, "userId", event.context.user.id, {
			httpOnly: false,
			sameSite: "lax",
			path: "/",
		});
	} else {
		deleteCookie(event, "userId");
	}

	setCookie(
		event,
		"AccessPermission",
		JSON.stringify(event.context.permissions)
	);
	return `Successfully updated permissions: ${JSON.stringify(event.context.permissions)}`;
});
