import type { FormFieldConfig } from "../../formConfig";

const therapies = [
	"Social Skills Workshop",
	"Assessment & Diagnosis",
	"Occupational Therapy",
	"Language Therapy",
	"Behavioral Therapy",
	"Learning Therapy",
	"Parental Support Group",
	"Preparation for Adult Life",
];

export const clinicInfoFields: FormFieldConfig[] = [
	{
		name: "evalDesired",
		label: "Would you like a diagnostic evaluation?",
		type: "radio",
		required: true,
	},
	{
		name: "previousPatient",
		label: "Have you previously been a patient with us?",
		type: "radio",
		required: true,
	},
	{
		name: "previousDiagnosis",
		label: "Have you been formally diagnosed?",
		type: "radio",
		required: true,
	},
	{
		name: "preferredTherapies",
		label: "Preferred Services/Therapies:",
		type: "multiselect",
		options: therapies.map((item) => ({ label: item, value: item })),
	},
];
