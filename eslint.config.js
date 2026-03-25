import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default withNuxt(
	// your additions/overrides go here
	{
		files: ["**/*.{js,mjs,cjs,ts,vue}"],
		ignores: [".nuxt/*"],
		languageOptions: {
			globals: globals.browser,
		},
	},

	{
		files: ["**/*.vue"],
		rules: {
			"vue/multi-word-component-names": [
				"warn",
				{ ignores: ["index", "Nav", "Footer"] },
			],
		},
	},

	eslintConfigPrettier
);
