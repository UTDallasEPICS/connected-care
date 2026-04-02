import type {
	FormSection,
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

function isEmpty(val: FormFieldValue): boolean {
	if (val === null || val === undefined) return true;
	if (typeof val === "string") return !val.trim();
	if (Array.isArray(val)) return val.length === 0;
	return false;
}

export function useFormValidation(
	blueprint: FormSection[],
	getFieldValue: (field: FormFieldConfig) => FormFieldValue
) {
	function validateBlueprint(): string | null {
		for (const section of blueprint) {
			for (const row of section.fields) {
				for (const field of row) {
					if (field.required && isEmpty(getFieldValue(field))) {
						return `${field.label} is required.`;
					}
				}
			}
		}
		return null;
	}

	return { validateBlueprint };
}
