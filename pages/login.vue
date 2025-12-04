<template>
	<div class="font-karla">
		<div
			class="flex min-h-[70vh] flex-col items-center justify-center gap-8"
		>
			<!-- Logo -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="w-60" />

			<!-- Login Form -->
			<form
				class="flex w-70 flex-col gap-5"
				@submit.prevent="handleSubmit"
			>
				<input
					required
					type="text"
					v-model="email"
					placeholder="User's Email"
					class="rounded-md bg-slate-100 p-2 outline-2 outline-blue-950 outline-solid"
				/>
				<button class="rounded-md bg-blue-950 p-2 text-white">
					Submit
				</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { $fetch } from "ofetch";
import { ref, useCookie, navigateTo } from "#imports";
import { AccessPermission } from "~/permissions";

const email = ref("");

async function handleSubmit() {
	await $fetch("/api/login", {
		method: "GET",
		query: { email: email.value },
	});

	// Fetch fresh permissions after login
	await $fetch("/api/updatePermissions", {
		method: "GET",
	});

	// Get updated cookie values
	const userId = useCookie("userId");
	const access = useCookie("AccessPermission");

	// Redirect based on permissions
	if (userId.value && access.value) {
		if (access.value[AccessPermission.ADMIN]) {
			await navigateTo("/admin");
		} else if (access.value[AccessPermission.USER_SERVICE]) {
			await navigateTo("/userServiceDashboard");
		} else if (access.value[AccessPermission.PARENT]) {
			await navigateTo("/parentDashboard");
		} else if (access.value[AccessPermission.PATIENT]) {
			await navigateTo("/patientDashboard");
		} else if (access.value[AccessPermission.THERAPIST]) {
			await navigateTo("/therapistDashboard");
		} else {
			await navigateTo("/Dashboard");
		}
	}
}
</script>
