<template>
	<transition name="slide">
		<div
			v-if="isMenuOpen"
			class="fixed inset-0 z-50 flex"
			aria-modal="true"
			role="dialog"
		>
			<!-- Backdrop -->
			<div
				class="fixed inset-0 z-10 bg-opacity-50"
				@click="toggleMenu"
			></div>

			<!-- Slide-out Menu Panel -->
			<div
				class="relative z-20 ml-auto flex h-screen w-2/3 max-w-xs flex-col bg-white p-6 shadow-lg"
			>
				<!-- Close button positioned on the right -->
				<div class="mb-4 flex justify-end">
					<button
						class=""
						aria-label="Close menu"
						@click="toggleMenu"
					>
						<X color="black" :size="30" />
					</button>
				</div>

				<nav class="flex grow flex-col">
					<NavBarLangSwap />
					<NuxtLink
						v-for="(link, idx) in userLinks"
						:key="idx"
						:to="localePath({ name: link.to, params: link.params })"
						class="py-2 text-end text-lg hover:underline"
						@click="toggleMenu"
					>
						{{ link.label }}
					</NuxtLink>
					<NavBarLogOut :mobile="true" />
				</nav>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import { useLocalePath } from "#imports";

const { userLinks } = useUserLinks();
const localePath = useLocalePath();

const { toggleMenu, isMenuOpen } = defineProps<{
	toggleMenu: () => void;
	isMenuOpen: boolean;
}>();
</script>

<style scoped>
/* Slide transition for the mobile menu */
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}
.slide-enter-to,
.slide-leave-from {
	transform: translateX(0);
}
</style>
