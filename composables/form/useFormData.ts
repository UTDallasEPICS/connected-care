import type {
	FormSection,
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

export type FormDataRecord = Record<
	string,
	FormFieldValue | Record<string, FormFieldValue>
>;

export function getEmptyValue(type: string): FormFieldValue {
	switch (type) {
		case "number":
			return 0;
		case "multitext":
		case "multiselect":
		case "checkboxgroup":
			return [];
		case "therapydrilldown":
			return { selected: "", checked: [] };
		case "objectivedetails":
			return { objectives: [], details: {}, date: "" };
		case "customgoals":
			return [];
		case "file":
			return null;
		default:
			return "";
	}
}

export function buildEmptyForm(blueprint: FormSection[]): FormDataRecord {
	const form: FormDataRecord = {};
	for (const section of blueprint) {
		for (const row of section.fields) {
			for (const field of row) {
				if (field.dataKey) {
					if (!form[field.dataKey]) form[field.dataKey] = {};
					(form[field.dataKey] as Record<string, FormFieldValue>)[
						field.name
					] = getEmptyValue(field.type);
				} else {
					form[field.name] = getEmptyValue(field.type);
				}
			}
		}
	}
	return form;
}

export function useFormData(blueprint: FormSection[]) {
	const formData = ref<FormDataRecord>(buildEmptyForm(blueprint));

	function getFieldValue(field: FormFieldConfig): FormFieldValue {
		if (field.dataKey) {
			const nested = formData.value[field.dataKey] as
				| Record<string, FormFieldValue>
				| undefined;
			return nested?.[field.name];
		}
		return formData.value[field.name] as FormFieldValue;
	}

	function setFieldValue(field: FormFieldConfig, val: FormFieldValue) {
		if (field.dataKey) {
			if (!formData.value[field.dataKey])
				formData.value[field.dataKey] = {};
			(formData.value[field.dataKey] as Record<string, FormFieldValue>)[
				field.name
			] = val;
		} else {
			formData.value[field.name] = val;
		}
	}

	function resetForm() {
		formData.value = buildEmptyForm(blueprint);
	}

	return { formData, getFieldValue, setFieldValue, resetForm };
}
