<template>
	<nav
		class="font-sc-encode flex items-center justify-between bg-blue-950 p-4 text-white shadow-md"
	>
		<!-- Logo -->
		<div
			class="flex cursor-pointer items-center"
			@click="dashboardNavigation"
		>
			<div class="text-xl font-bold">Connected Care</div>
		</div>

		<!-- Hamburger menu button: visible only on mobile -->
		<NavBarMobileMenuButton :toggle-menu="toggleMenu" />

		<div class="hidden items-center gap-6 sm:flex">
			<!-- Language Switcher -->
			<NavBarLangSwap />
			<!-- Desktop Navigation Links -->
			<div class="gap-4 sm:flex">
				<NuxtLink
					v-for="(link, idx) in userLinks"
					:key="idx"
					:to="resolveLink(link)"
					class="hover:underline"
				>
					{{ link.label }}
				</NuxtLink>
			</div>

			<!-- Logout Button -->
			<NavBarLogOut :mobile="false" />
		</div>
	</nav>

	<!-- Mobile Pop-Out Menu -->
	<NavBarMobile :toggle-menu="toggleMenu" :is-menu-open="isMenuOpen" />
</template>

<script setup lang="ts">
import { useLocalePath, ref } from "#imports";
import { useDashboardNavigation } from "~/composables/auth/useDashboardNavigation";
import { useUserLinks } from "~/composables/auth/useUserLinks";

const localePath = useLocalePath();
const { dashboardNavigation } = useDashboardNavigation();
const { userLinks } = useUserLinks();

const isMenuOpen = ref(false);

function toggleMenu() {
	isMenuOpen.value = !isMenuOpen.value;
}

function resolveLink(link: {
	to?: string;
	path?: string;
	params?: { id: string };
}) {
	if (link.path) {
		return localePath(link.path);
	}

	if (link.to) {
		return localePath({ name: link.to, params: link.params });
	}

	return localePath("/");
}
</script>
