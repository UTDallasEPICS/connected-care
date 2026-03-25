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
					:to="localePath({ name: link.to, params: link.params })"
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

const localePath = useLocalePath();
const { dashboardNavigation } = useDashboardNavigation();
const { userLinks } = useUserLinks();

const isMenuOpen = ref(false);

function toggleMenu() {
	isMenuOpen.value = !isMenuOpen.value;
}
</script>
