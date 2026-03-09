export default defineI18nConfig(() => ({
	legacy: false,
	locale: "en",
	fallbackLocale: "en",
	dateTimeFormats: {
		en: {
			short: {
				year: "numeric",
				month: "short",
				day: "numeric",
			},
			long: {
				year: "numeric",
				month: "long",
				day: "numeric",
				weekday: "long",
			},
			time: {
				hour: "2-digit",
				minute: "2-digit",
			},
		},
		es: {
			short: {
				year: "numeric",
				month: "short",
				day: "numeric",
			},
			long: {
				year: "numeric",
				month: "long",
				day: "numeric",
				weekday: "long",
			},
			time: {
				hour: "2-digit",
				minute: "2-digit",
			},
		},
	},
}));
