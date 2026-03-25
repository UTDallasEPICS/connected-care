import type { FormFieldConfig } from "../../formConfig";

export const generalInfoFields: FormFieldConfig[] = [
	{
		name: "firstName",
		label: "First Name",
		type: "text",
		placeholder: "Jane",
		required: true,
	},
	{
		name: "middleName",
		label: "Middle Name",
		type: "text",
		placeholder: "A.",
	},
	{
		name: "lastName",
		label: "Last Name",
		type: "text",
		placeholder: "Doe",
		required: true,
	},
	{ name: "age", label: "Age", type: "number", placeholder: "30" },
	{ name: "DOB", label: "Date of Birth", type: "date" },
	{
		name: "gender",
		label: "Gender",
		type: "select",
		options: [
			{ label: "Female", value: "female" },
			{ label: "Male", value: "male" },
			{ label: "Non-binary", value: "non-binary" },
			{ label: "Prefer not to say", value: "unspecified" },
		],
	},
];
