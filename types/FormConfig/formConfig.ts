type InputType = 
| "text"
| "number"
| "date"
| "email" 
| "radio"
| "select"
| "file"
| "multitext" // custom type for dropdowns
| "multiselect" // custom type for dropdowns where you can select multiple

export interface FormFieldConfig {
    name: string;
    label: string;
    type: InputType;
    placeholder?: string;
    options?: { // specifically for select and multiselect
        label: string;
        value: string;
    }[];
    required?: boolean;
    // Specifically for file uploads
    accept?: string;
    multiple?: boolean;
}

export interface FormSection {
    sectionTitle: string;
    fields: FormFieldConfig[];
}

export type FormFieldValue = 
| string
| number
| boolean
| string[]
| File
| File[]
| null
| undefined
