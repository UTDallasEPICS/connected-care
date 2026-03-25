import { generalInfoFields } from "./UserForms/UserInfoTypes/userGeneralInfo";
import { locationInfoFields } from "./UserForms/UserInfoTypes/userLocationInfo";
import { contactInfoFields } from "./UserForms/UserInfoTypes/userContactInfo";
import { medicalInfoFields } from "./UserForms/UserInfoTypes/userMedicalInfo";
import { clinicInfoFields } from "./UserForms/UserInfoTypes/userClinicInfo";

import { therapyReinforcerFields } from "./TherapyForms/TherapyInfoTypes/therapyReinforcerInfo";
import {
	therapyFamilyRecommendationFields,
	therapyGroupRecommendationFields,
} from "./TherapyForms/TherapyInfoTypes/therapyRecommendationInfo";
import { therapyGoalsFields } from "./TherapyForms/TherapyInfoTypes/therapyGoalsInfo";
import {
	therapyProgressNotesFields,
	therapyNextSessionFields,
} from "./TherapyForms/TherapyInfoTypes/therapyProgressInfo";
import {
	therapyIncidentFields,
	therapyObservationFields,
} from "./TherapyForms/TherapyInfoTypes/therapyIncidentInfo";

import type { FormFieldConfig, FormSection } from "./formConfig";

function toRows(fields: FormFieldConfig[]): FormFieldConfig[][] {
	return fields.map((f) => [f]);
}

export const userFormBlueprint: FormSection[] = [
	{ sectionTitle: "General Information", fields: toRows(generalInfoFields) },
	{ sectionTitle: "Location", fields: toRows(locationInfoFields) },
	{ sectionTitle: "Contact Information", fields: toRows(contactInfoFields) },
	{ sectionTitle: "Medical Info", fields: toRows(medicalInfoFields) },
	{ sectionTitle: "Clinic Info", fields: toRows(clinicInfoFields) },
];

export const formBlueprint = userFormBlueprint;

export const therapyFormBlueprint: FormSection[] = [
	{
		sectionTitle: "General",
		fields: [therapyReinforcerFields],
	},
	{
		sectionTitle: "Progress",
		fields: [
			therapyGoalsFields,
			therapyProgressNotesFields,
			therapyNextSessionFields,
		],
	},
	{
		sectionTitle: "Observations & Recommendations",
		fields: [
			therapyFamilyRecommendationFields,
			therapyGroupRecommendationFields,
			therapyIncidentFields,
			therapyObservationFields,
		],
	},
];
