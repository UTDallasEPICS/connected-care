<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<!--Image here -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="mb-10 w-45" />

			<!-- Buttons -->
			<div class="cols-4 grid grid-cols-4 gap-8 text-center sm:grid">
				<!-- schedule -->

				<div class="flex flex-col items-center">
					<button
						@click="goTo('/scheduleView')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					></button>
					<span class="text -sm font-medium">SCHEDULE</span>
				</div>

				<!-- View contact forms -->
				<div class="flex flex-col items-center">
					<button
						@click="goTo('/viewContactForms')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					></button>
					<span class="text -sm font-medium"
						>VIEW NEW<br />
						CONTACT FORMS</span
					>
				</div>

				<!-- view employees -->
				<div class="flex flex-col items-center">
					<button
						@click="goTo('/employees')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					></button>
					<span class="text -sm font-medium">VIEW EMPLOYEES</span>
				</div>
				<!-- create account -->

				<div class="flex flex-col items-center">
					<button
						@click="goTo('/createAccount')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					></button>
					<span class="text -sm font-medium">CREATE ACCOUNT</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { AccessPermission } from "~/permissions";

// Access cookies for authentication / role check
const access = useCookie("AccessPermission");

// Redirect if not admin
if (access.value !== AccessPermission.ADMIN) {
	navigateTo("/dashboard");
}

// Navigation helper
function goTo(path: string) {
	navigateTo(path);
}
</script>
