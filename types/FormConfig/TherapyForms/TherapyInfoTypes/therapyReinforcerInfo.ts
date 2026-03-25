import type { FormFieldConfig } from "../../formConfig";

export const therapyReinforcerFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "Reinforcers used (if applicable)",
		type: "textarea",
		dataKey: "reinforcers",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "reinforcers",
	},
];
