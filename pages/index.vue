<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<!-- Logo -->
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="mb-16 w-60" />

			<!-- Buttons -->
			<div class="flex w-64 flex-col gap-4">
				<!-- Login Button -->
				<button
					@click="goToLogin"
					class="rounded-md bg-blue-950 px-8 py-4 text-center text-lg font-medium text-white transition hover:bg-blue-900"
				>
					Log In
				</button>

				<!-- Sign Up Button -->
				<button
					@click="goToSignUp"
					class="rounded-md border-2 border-blue-950 bg-white px-8 py-4 text-center text-lg font-medium text-blue-950 transition hover:bg-gray-50"
				>
					Sign Up
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { navigateTo } from "#imports";

function goToLogin() {
	navigateTo("/login");
}

function goToSignUp() {
	navigateTo("/contactForm");
}
</script>
