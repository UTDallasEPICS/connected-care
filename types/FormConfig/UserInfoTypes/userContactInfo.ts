import type { FormFieldConfig } from "../formConfig";

export const contactInfoFields: FormFieldConfig[] = [
    { name: "email", label: "Enter email", type: "text", placeholder: "johndoe@email.com", required: true },
    { name: "whatsapp", label: "Enter whatsapp", type: "number", required: false },
    { name: "phone", label: "Enter Phone #", type: "number", required: true }
]
