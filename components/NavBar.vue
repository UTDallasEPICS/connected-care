<template>
	<nav
		class="font-sc-encode flex items-center justify-between bg-blue-950 p-4 text-white shadow-md"
	>
		<!-- Logo -->
		<NuxtLink :to="localePath('index')" class="flex items-center space-x-2">
			<div class="text-xl font-bold">Connected Care</div>
		</NuxtLink>

		<!-- Hamburger menu button: visible only on mobile -->
		<div class="sm:hidden">
			<button @click="toggleMenu" aria-label="Toggle menu">
				<!-- Simple hamburger icon -->
				<Menu />
			</button>
		</div>

		<div class="hidden items-center gap-6 sm:flex">
			<div class="flex items-center gap-2">
				<button
					class="px-2 py-1 rounded text-sm"
					:class="locale === 'en' ? 'bg-white text-blue-950 font-semibold' : 'bg-blue-900 text-white'"
					@click="switchLanguage('en')"
				>
					EN
				</button>
				<button
					class="px-2 py-1 rounded text-sm"
					:class="locale === 'es' ? 'bg-white text-blue-950 font-semibold' : 'bg-blue-900 text-white'"
					@click="switchLanguage('es')"
				>
					ES
				</button>
			</div>

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
			<button v-if="userId" class="cursor-pointer" @click="logout">
				<LogOut />
			</button>
		</div>
	</nav>

	<!-- Mobile Pop-Out Menu -->
	<transition name="slide">
		<div
			v-if="isMenuOpen"
			class="fixed inset-0 z-50 flex"
			aria-modal="true"
			role="dialog"
		>
			<!-- Backdrop -->
			<div
				class="bg-opacity-50 fixed inset-0 z-10"
				@click="toggleMenu"
			></div>

			<!-- Slide-out Menu Panel -->
			<div
				class="relative z-20 ml-auto flex h-screen w-2/3 max-w-xs flex-col bg-white p-6 shadow-lg"
			>
				<!-- Close button positioned on the right -->
				<div class="mb-4 flex justify-end">
					<button
						@click="toggleMenu"
						class=""
						aria-label="Close menu"
					>
						<X color="black" :size="30" />
					</button>
				</div>

				<nav class="flex grow flex-col">
					<div class="mb-4 flex justify-end gap-2">
						<button
							class="px-2 py-1 rounded text-sm"
							:class="locale === 'en' ? 'bg-blue-950 text-white font-semibold' : 'bg-gray-200 text-black'"
							@click="() => { switchLanguage('en'); }"
						>
							EN
						</button>
						<button
							class="px-2 py-1 rounded text-sm"
							:class="locale === 'es' ? 'bg-blue-950 text-white font-semibold' : 'bg-gray-200 text-black'"
							@click="() => { switchLanguage('es'); }"
						>
							ES
						</button>
					</div>

					<NuxtLink
						v-for="(link, idx) in userLinks"
						:key="idx"
						:to="localePath({ name: link.to, params: link.params })"
						class="py-2 text-end text-lg hover:underline"
						@click="toggleMenu"
					>
						{{ link.label }}
					</NuxtLink>
					<div class="grow"></div>
					<button
						v-if="userId"
						class="py-2 text-end text-lg hover:underline"
						@click="logout"
					>
						Log Out
					</button>
				</nav>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { X, LogOut, Menu } from "lucide-vue-next";
import { ref, computed, useCookie, navigateTo, useI18n } from "#imports";
import { AccessPermission } from "~/permissions";

const localePath = useLocalePath();
const { locale, setLocale } = useI18n();
const userId = useCookie("userId");
const access = useCookie("AccessPermission");

const userLinks = computed(() => {
	let legalRoutes = [];
	// protect against undefined access throwind error
	if (!access.value) {
		return legalRoutes;
	}
	// add relevant links
	if (access.value[AccessPermission.USER]) {
		legalRoutes.push({ to: "scheduleView", label: "Schedule" });
	}
	if (access.value[AccessPermission.PATIENT]) {
		legalRoutes.push({
			to: "myProfile-id",
			params: { id: userId.value },
			label: "Profile",
		});
	}
	if (access.value[AccessPermission.PARENT]) {
		legalRoutes.push({ to: "childSearch", label: "Children" });
	}
	if (access.value[AccessPermission.STAFF]) {
		legalRoutes.push({ to: "patientSearch", label: "Patients" });
		legalRoutes.push({
			to: "viewContactForms",
			label: "Review Forms",
		});
	}
	if (access.value[AccessPermission.ADMIN]) {
<<<<<<< Updated upstream
		legalRoutes.push({ to: { name: "admin" }, label: "Admin" });
		legalRoutes.push({
			to: { name: "employeeSearch" },
			label: "Employees",
		});
=======
		legalRoutes.push({ to: "admin", label: "Admin" });
>>>>>>> Stashed changes
	}
	return legalRoutes;
});

const isMenuOpen = ref(false);
function toggleMenu() {
	isMenuOpen.value = !isMenuOpen.value;
}

function switchLanguage(code: 'en' | 'es') {
	setLocale(code);
}

async function logout() {
	isMenuOpen.value = false;
	const userId = useCookie("userId");
	userId.value = null;
	access.value = null;

	// not having await seems to cause an issue with the order of page components
	//  putting the footer above the page content
	console.log("User logged out");
	await navigateTo(localePath("index"));
}
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
