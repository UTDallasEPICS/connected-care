import { z } from "zod";
import { Gender, ContactType } from "@prisma/client";

/** Fields shared between contact form creation and patient profile update */
export const patientBaseSchema = z.object({
	fName: z.string(),
	mInit: z.string().max(1).optional().nullable(),
	lName: z.string(),
	gender: z.nativeEnum(Gender),
	dob: z.coerce.date(),
	streetName: z.string(),
	streetNum: z.number(),
	buildingNum: z.number().optional().nullable(),
	postcode: z.number(),
	city: z.string(),
	identification: z.string(),
	contactPref: z.nativeEnum(ContactType).default("PHONE"),
	email: z.string().email().optional(),
	phone: z.string(),
	whatsapp: z.string().optional(),
	isDiagnosed: z.boolean(),
});
