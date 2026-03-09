<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<!--Image here -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="w-45 mb-10" />

			<!-- Buttons -->
			<div class="cols-4 grid grid-cols-4 gap-8 text-center sm:grid">
				<!-- schedule -->

				<div class="flex flex-col items-center">
					<button
						@click="goTo('/scheduleView')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					>
						<Calendar :size="84" color="black" />
					</button>
					<span class="text -sm font-medium">{{
						$t("Schedule")
					}}</span>
				</div>

				<!-- View contact forms -->
				<div class="flex flex-col items-center">
					<button
						@click="goTo('/viewContactForms')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					>
						<FileText :size="84" color="black" />
					</button>
					<span class="text -sm font-medium">{{
						$t("View New Contact Forms")
					}}</span>
				</div>

				<!-- view employees -->
				<div class="flex flex-col items-center">
					<button
						@click="goTo('/employeeSearch')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					>
						<Users :size="84" color="black" />
					</button>
					<span class="text -sm font-medium">{{
						$t("View Employees")
					}}</span>
				</div>
				<!-- create account -->
				<div class="flex flex-col items-center">
					<button
						@click="goTo('/createAccount')"
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
					>
						<UserPlus :size="84" color="black" />
					</button>
					<span class="text -sm font-medium">{{
						$t("Create Account")
					}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { AccessPermission } from "~/permissions";
import { Calendar, FileText, Users, UserPlus } from "lucide-vue-next";

// Access cookies for authentication / role check
const access = useCookie("AccessPermission");

// Redirect if not admin
if (!access.value?.[AccessPermission.ADMIN]) {
	navigateTo("/dashboard");
}

// Navigation helper
function goTo(path: string) {
	navigateTo(path);
}
</script>
