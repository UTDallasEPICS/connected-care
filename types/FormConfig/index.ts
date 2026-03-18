import { generalInfoFields } from "./UserInfoTypes/userGeneralInfo";
import { locationInfoFields } from "./UserInfoTypes/userLocationInfo";
import { contactInfoFields } from "./UserInfoTypes/userContactInfo";
import { medicalInfoFields } from "./UserInfoTypes/userMedicalInfo";
import { clinicInfoFields } from "./UserInfoTypes/userClinicInfo";

import type { FormSection } from "./formConfig";

export const formBlueprint: FormSection[] = [
    { sectionTitle: "General Information", fields: generalInfoFields },
    { sectionTitle: "Location", fields: locationInfoFields },
    { sectionTitle: "Contact Information", fields: contactInfoFields },
    { sectionTitle: "Medical Info", fields: medicalInfoFields }, 
    { sectionTitle: "Clinic Info", fields: clinicInfoFields }
]
