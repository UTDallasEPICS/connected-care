<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<!--Image here -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="mb-10 w-45" />

			<!-- Buttons -->
			<div class="cols-2 grid grid-cols-2 gap-8 text-center sm:grid">
				<!-- view schedule -->

				<div class="flex flex-col items-center">
					<button
						@click="goTo('/scheduleView')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					></button>
					<Calendar :size="84" color="black" />
					<span class="text -sm font-medium">SCHEDULE</span>
				</div>

				<!-- view profile -->
				<div class="flex flex-col items-center">
					<button
						@click="goTo('/[id]')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					></button>
					<User :size="84" color="black" />
					<span class="text -sm font-medium">VIEW PROFILE</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { AccessPermission } from "~/permissions";
import { Calendar, User } from "lucide-vue-next";

// Access cookies for authentication / role check
const access = useCookie("AccessPermission");

// Redirect if not admin
if (!access.value?.[AccessPermission.PATIENT]) {
	navigateTo("/dashboard");
}

// Navigation helper
function goTo(path: string) {
	navigateTo(path);
}
</script>
