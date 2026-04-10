<template>
	<div class="font-karla">
		<div
			class="flex min-h-[70vh] flex-col items-center justify-center gap-8 mt-[170px]"
		>"
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
			<div class="flex justify-center mt-[100px]">
			<h2 class="font-bold text-[50px] text-red-500">
				OR
			</h2>
			</div>
		<div class="flex justify-center">
		<button @click="gotocontactform" class="text-[50px] hover:text-blue-800 mt-[50px] ">
			Sign Up
		</button>
			
				
			</div>	
			
		</div>
	</div>
</template>

<script lang="ts" setup>
import { $fetch } from "ofetch";
import { ref } from "#imports";

const email = ref("");
function gotocontactform(){
	navigateTo('/contactForm')


}

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
