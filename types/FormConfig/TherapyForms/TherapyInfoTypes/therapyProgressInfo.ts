import type { FormFieldConfig } from "../../formConfig";

export const therapyProgressNotesFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "Progress notes (what happened in therapy)",
		type: "textarea",
		required: true,
		dataKey: "progressNotes",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "progressNotes",
	},
];

export const therapyNextSessionFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "Objectives for next therapy session",
		type: "textarea",
		required: true,
		dataKey: "nextSessionObjectives",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "nextSessionObjectives",
	},
];
