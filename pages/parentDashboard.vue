<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<!--Image here -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="w-45 mb-10" />
			<!-- Buttons -->
			<div class="cols-2 grid grid-cols-2 gap-8 text-center sm:grid">
				<!-- view schedule -->
				<div class="flex flex-col items-center">
					<button
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
						@click="goTo('/scheduleView')"
					>
						<Calendar :size="84" color="black" />
					</button>
					<span class="text -sm font-medium">SCHEDULE</span>
				</div>
				<!-- view profile -->
				<div class="flex flex-col items-center">
					<button
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
						@click="goTo({ name: 'childSearch' })"
					>
						<User :size="84" color="black" />
					</button>
					<span class="text -sm font-medium"
						>VIEW CHILDREN'S <br />PROFILES</span
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { onMounted } from "vue";
import { AccessPermission } from "~/types/permissions";
import { Calendar, User } from "lucide-vue-next";
// Access cookies for authentication / role check
const access = useCookie("AccessPermission");
// Redirect if not patient
onMounted(() => {
	if (!access.value?.[AccessPermission.PARENT]) {
		navigateTo("/dashboard");
	}
});
// Navigation helper
function goTo(path: string) {
	navigateTo(path);
}
</script>
