import type { FormFieldConfig } from "../../formConfig";

export const therapyFamilyRecommendationFields: FormFieldConfig[] = [
	{
		name: "value",
		label: "Recommendations for the family and/or user",
		type: "textarea",
		dataKey: "familyRecommendations",
	},
	{
		name: "date",
		label: "Date",
		type: "date",
		dataKey: "familyRecommendations",
	},
];

export const therapyGroupRecommendationFields: FormFieldConfig[] = [
	{
		name: "groupRecommendationParents",
		label: "Group recommendation for parents",
		type: "textarea",
		placeholder: "Group recommendation directed to parents",
	},
];
