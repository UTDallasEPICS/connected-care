// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	modules: ['@nuxtjs/i18n'],
	i18n: {
		locales: [
		{ code: 'en', iso: 'en-US', file: 'en.json' },
		{ code: 'es', iso: 'es-ES', file: 'es.json' }
		],
		defaultLocale: 'en',
		langDir: 'locales/',
		strategy: 'no_prefix',
		vueI18n: './i18n.config.ts'
	},
	compatibilityDate: "2024-11-01",
	devtools: { enabled: false },
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	hooks: {
		"pages:extend"(pages) {
			pages.push({
				name: "myProfile-id",
				path: "/myProfile/:id",
				file: "~/pages/patientProfile/[id].vue",
			});
			pages.push({
				name: "childProfile-id",
				path: "/childProfile/:id",
				file: "~/pages/patientProfile/[id].vue",
			});
			pages.push({
				name: "childSearch",
				path: "/myChildren",
				file: "~/pages/patientSearch.vue",
			});
		},
	},
				
});