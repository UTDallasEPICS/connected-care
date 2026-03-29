import type { JsonObject } from "@prisma/client/runtime/library";

// Helper Interfaces

export interface MedicalHistory {
	previousPatient: boolean;
	status: string;
	diagnosed: boolean;
	medicalRecordFiles: JsonObject[];
	appointments: Appointment[];
}

interface Appointment {
	date: string;
	comments: string[];
	evaluation: string;
	diagnosis: string;
}

// Primary interfaces

interface UserGeneralInfo {
	firstName: string;
	middleName: string;
	lastName: string;
	age: number;
	DOB: string;
	gender: string;
}

interface UserLocationInfo {
	address: string;
	postcode: number;
	city: string;
	country: string;
}

interface UserContactInfo {
	email: string;
	whatsapp: number;
	phone: number;
}

interface UserMedicalInfo {
	medication: string[];
	allergies: string[];
	diet: string; // I still don't know what this is used for
	insurance: string;
	medicalRecords: File[] | null;
}

interface UserClinicInfo {
	evalDesired: boolean;
	previousPatient: boolean;
	previousDiagnosis: boolean;
	preferredTherapies: string[];
}

export type UserInfo = UserGeneralInfo &
	UserLocationInfo &
	UserContactInfo &
	UserMedicalInfo &
	UserClinicInfo;
