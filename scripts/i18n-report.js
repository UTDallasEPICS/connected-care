import VueI18NExtract from "vue-i18n-extract";

const report = VueI18NExtract.createI18NReport({
	vueFiles: "./{components,pages}/*.vue",
	languageFiles: "./i18n/locales/*.json",
	add: true,
});

console.log(report);
