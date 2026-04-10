<template>
	<footer class="mt-auto bg-blue-950 py-4 text-white">
		<div
			class="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row"
		>
			<p class="text-sm">
				&copy; {{ new Date().getFullYear() }} Fundación Manos Unidas por
				Autismo
			</p>
			<nav class="mt-2 flex space-x-4 md:mt-0">
				<NuxtLink
					to="https://www.manosunidasporautismo.org/"
					class="hover:underline"
					>{{ $t("About") }}</NuxtLink
				>
				<NuxtLink
					:to="localePath({ name: 'contact', params: {} })"
					class="hover:underline"
					>{{ $t("Contact") }}</NuxtLink
				>
			</nav>
		</div>
	</footer>
</template>

<script lang="ts" setup>
/* Nothing special yet — you can add props or logic later */
import { useLocalePath } from "#imports";
const localePath = useLocalePath();
</script>
