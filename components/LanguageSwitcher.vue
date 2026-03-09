<template>
	<div>
		<button
			v-for="lang in availableLangs"
			:key="lang"
			:class="{ active: lang === currentLang }"
			@click="setLanguage(lang)"
		>
			{{ lang.toUpperCase() }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { useLanguage } from "~/composables/useLanguage";
const { currentLang, availableLangs, setLanguage } = useLanguage();
</script>
