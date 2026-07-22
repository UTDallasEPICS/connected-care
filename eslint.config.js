import eslintConfigPrettier from "eslint-config-prettier";
import { withNuxt } from "./.nuxt/eslint.config.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default withNuxt({
	extends: [eslintConfigPrettier],
	rules: {
		"vue/multi-word-component-names": [
			"warn",
			{
				ignores: ["index", "Nav", "Footer"],
			},
		],
	},
});
