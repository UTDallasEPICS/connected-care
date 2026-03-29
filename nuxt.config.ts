// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	modules: ["@nuxtjs/i18n"],
	i18n: {
		locales: [
			{ code: "en", iso: "en-US", file: "en.json" },
			{ code: "es", iso: "es-ES", file: "es.json" },
		],
		defaultLocale: "en",
		langDir: "locales/",
		strategy: "no_prefix",
		vueI18n: "./i18n.config.ts",
	},
	compatibilityDate: "2024-11-01",
	devtools: { enabled: false },
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	hooks: {
		"pages:extend"(pages) {
<<<<<<< HEAD
=======
			// Override auto-generated routes for moved pages to maintain backward compatibility
			const routeOverrides: Record<
				string,
				{ path: string; file: string }
			> = {
				"dashboard-admin": {
					path: "/admin",
					file: "~/pages/dashboard/admin.vue",
				},
				"dashboard-parentDashboard": {
					path: "/parentDashboard",
					file: "~/pages/dashboard/parentDashboard.vue",
				},
				"dashboard-patientDashboard": {
					path: "/patientDashboard",
					file: "~/pages/dashboard/patientDashboard.vue",
				},
				"dashboard-therapistDashboard": {
					path: "/therapistDashboard",
					file: "~/pages/dashboard/therapistDashboard.vue",
				},
				"dashboard-userServiceDashboard": {
					path: "/userServiceDashboard",
					file: "~/pages/dashboard/userServiceDashboard.vue",
				},
				"dashboard-dashboard": {
					path: "/dashboard",
					file: "~/pages/dashboard/dashboard.vue",
				},
				"auth-login": {
					path: "/login",
					file: "~/pages/auth/login.vue",
				},
				//				"patient-patientSearch": {
				//path: "/patientSearch",
				//file: "~/pages/patient/patientSearch.vue",
				//},
				"patient-contactForm": {
					path: "/contactForm",
					file: "~/pages/patient/contactForm.vue",
				},
				"patient-viewContactForms": {
					path: "/viewContactForms",
					file: "~/pages/patient/viewContactForms.vue",
				},
				"patient-testingForm": {
					path: "/testingForm",
					file: "~/pages/patient/testingForm.vue",
				},
				"admin-userSearch": {
					path: "/userSearch",
					file: "~/pages/admin/userSearch.vue",
				},
				// "admin-employeeSearch": {
				// 	path: "/employeeSearch",
				// 	file: "~/pages/admin/employeeSearch.vue",
				// },
				"admin-scheduleView": {
					path: "/scheduleView",
					file: "~/pages/admin/scheduleView.vue",
				},
			};

			// Update existing routes
			pages.forEach((page) => {
				const override = routeOverrides[page.name || ""];
				if (override) {
					page.path = override.path;
					page.file = override.file;
				}
			});

			// Add custom patient profile routes
>>>>>>> db7427d9e980512972ef7b966ecb0b66ba40f013
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
