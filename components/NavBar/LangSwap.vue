<template>
	<div class="flex items-center gap-2">
		<button
			v-for="lang in langs"
			:key="lang"
			:class="langClass(lang)"
			@click="switchLanguage(lang)"
		>
			{{ lang.toUpperCase() }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";

const { locale, setLocale } = useI18n();

// CSS classes
const active = "bg-white font-semibold text-blue-950";
const inactive = "bg-blue-900 text-white";
const defClass = "rounded px-2 py-1 text-sm";

// For looping through buttons and adding the correct class (as const makes it so TS sees this as literally an array of just "en" and "es", no other strings):
const langs = ["en", "es"] as const;

// combine the default class that both buttons have with the active/inactive class, based on what locale.value is atm. Join combines these two strings into one string
const langClass = (lang: string) =>
	[defClass, locale.value === lang ? active : inactive].join(" ");

// swapping between english and spanish

function switchLanguage(code: "en" | "es") {
	setLocale(code);
}
</script>
