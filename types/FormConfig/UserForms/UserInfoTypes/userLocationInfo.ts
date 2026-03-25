import type { FormFieldConfig } from "../../formConfig";

export const locationInfoFields: FormFieldConfig[] = [
	{ name: "address", label: "Enter Address", type: "text", required: true },
	{
		name: "postcode",
		label: "Enter Postcode",
		type: "number",
		required: true,
	},
	{ name: "city", label: "Enter City", type: "text", required: true },
	{ name: "country", label: "Enter Country", type: "text", required: true },
];
