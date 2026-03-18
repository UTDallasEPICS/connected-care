import type { FormFieldConfig } from "../formConfig";

const insuranceOptions = [
    "SENASA contributivo",
    "SENASA subsidiado",
    "ARS HUMANO",
    "MAPFRE",
    "LA MONUMENTAL",
    "ARS Universal",
    "ARS Meta Salud",
    "ARS Plan Salud Banco Central",
    "RENACER",
    "Otro",
    "Not Listed", 
]

export const medicalInfoFields: FormFieldConfig[] = [
    { name: "medication", label: "Enter medication(s)", type: "multitext", placeholder: "Add medication" },
    { name: "allergies", label: "Enter allergy(ies)", type: "multitext", placeholder: "Add allergies" },
    { name: "diet", label: "Diet", type: "text", placeholder: "Enter dietary restrictions" },
    { name: "insurance", label: "Medical Insurance", type: "select", placeholder: "Select Insurance", required: true, 
        options: insuranceOptions.map(item => ({ label: item, value: item}))
    },
    { name: "medicalRecords", label: "Please submit any medical records.", type: "file", placeholder: "Choose Files", accept: "application/pdf, image/png, image/jpeg", multiple: true }
]
