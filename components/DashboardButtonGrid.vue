<template>
	<div class="font-karla">
		<div class="flex min-h-[70vh] flex-col items-center justify-center">
			<img src="/manos-unidas-logo.jpg" alt="Logo" class="w-45 mb-10" />
			<div
				:class="`cols-${buttons.length} grid grid-cols-${buttons.length} gap-8 text-center sm:grid`"
			>
				<div
					v-for="button in buttons"
					:key="button.path"
					class="flex flex-col items-center"
				>
					<button
						class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gray-300 p-6 transition hover:bg-gray-400"
						@click="goTo(button.path)"
					>
						<component :is="button.icon" :size="84" color="black" />
					</button>
					<span class="text-sm font-medium">{{ button.label }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { navigateTo } from "#imports";
import type { Component } from "vue";

interface Button {
	path: string | { name: string; params?: Record<string, unknown> };
	icon: Component;
	label: string;
}

defineProps<{
	buttons: Button[];
}>();

function goTo(
	path: string | { name: string; params?: Record<string, unknown> }
) {
	navigateTo(path);
}
</script>
