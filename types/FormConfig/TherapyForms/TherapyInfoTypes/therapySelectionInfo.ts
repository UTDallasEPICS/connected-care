import type { FormFieldConfig } from "../../formConfig";

export const therapySelectionFields: FormFieldConfig[] = [
	{
		name: "selectedTherapy",
		label: "Therapy (drill down)",
		type: "select",
		required: true,
		options: [
			{ label: "Learning Therapy", value: "LEARNING_THERAPY" },
			{
				label: "Behavioral Therapy & Early Intervention Therapy",
				value: "BEHAVIORAL_EARLY",
			},
			{ label: "Speech Therapy", value: "SPEECH_THERAPY" },
			{ label: "Social Skills Therapy", value: "SOCIAL_SKILLS" },
			{ label: "Occupational Therapy", value: "OCCUPATIONAL_THERAPY" },
			{
				label: "Independent Living Skills Training Program",
				value: "INDEPENDENT_LIVING",
			},
		],
	},
];
