import type { FormFieldConfig } from "../../formConfig";

export const therapyGoalsFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "Goals achieved",
		type: "textarea",
		required: true,
		dataKey: "goalsAchieved",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "goalsAchieved",
	},
];
