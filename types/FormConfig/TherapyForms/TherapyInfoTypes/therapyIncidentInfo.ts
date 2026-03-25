import type { FormFieldConfig } from "../../formConfig";

export const therapyIncidentFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "Incidents (if applicable)",
		type: "textarea",
		dataKey: "incidents",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "incidents",
	},
];

export const therapyObservationFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "General observations",
		type: "textarea",
		required: true,
		dataKey: "generalObservations",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "generalObservations",
	},
];
