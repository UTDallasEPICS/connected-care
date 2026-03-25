<template>
	<div class="font-karla">
		<div
			class="flex min-h-[70vh] flex-col items-center justify-center gap-8"
		>
			<!-- Logo -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="w-60" />

			<!-- Login Form -->
			<form
				class="w-70 flex flex-col gap-5"
				@submit.prevent="handleSubmit"
			>
				<input
					v-model="email"
					required
					type="text"
					placeholder="User's Email"
					class="outline-solid rounded-md bg-slate-100 p-2 outline-2 outline-blue-950"
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
import { ref } from "#imports";

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

	const { dashboardNavigation } = useDashboardNavigation();
	dashboardNavigation();
}
</script>
