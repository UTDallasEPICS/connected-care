<template>
	<div class="sm:hidden">
		<button aria-label="Toggle menu" @click="toggleMenu">
			<!-- Simple hamburger icon -->
			<Menu />
		</button>
	</div>
</template>

<script setup lang="ts">
import { Menu } from "lucide-vue-next";

const { toggleMenu } = defineProps<{
	toggleMenu: () => void;
}>();
</script>
