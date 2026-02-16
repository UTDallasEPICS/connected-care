<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<!--Image here -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="w-45 mb-10" />

			<!-- Buttons -->
			<div class="cols-3 grid grid-cols-3 gap-8 text-center sm:grid">
				<!-- view schedule -->
				<div class="flex flex-col items-center">
					<button
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
						@click="goTo('/scheduleView')"
					>
						<Calendar :size="84" color="black" />
					</button>
					<span class="text-sm font-medium">SCHEDULE</span>
				</div>

				<!-- view patients -->
				<div class="flex flex-col items-center">
					<button
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
						@click="goTo('/patientSearch')"
					>
						<Users :size="84" color="black" />
					</button>

					<span class="text-sm font-medium">VIEW PATIENTS</span>
				</div>

				<!-- View contact forms -->
				<div class="flex flex-col items-center">
					<button
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
						@click="goTo('/viewContactForms')"
					>
						<FileText :size="84" color="black" />
					</button>
					<span class="text-sm font-medium"
						>VIEW NEW<br />
						CONTACT FORMS</span
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
import { Calendar, Users, FileText } from "lucide-vue-next";

// Access cookies for authentication / role check
const access = useCookie("AccessPermission");

// Redirect if not user service
onMounted(() => {
	if (!access.value?.[AccessPermission.USER_SERVICE]) {
		navigateTo("/dashboard");
	}
});

// Navigation helper
function goTo(path: string) {
	navigateTo(path);
}
</script>
