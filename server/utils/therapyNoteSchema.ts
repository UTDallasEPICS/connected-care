import { z } from "zod";

export const objectiveSchema = z.object({
	goalKey: z.string().optional().nullable(),
	goalLabel: z.string(),
	details: z.string().optional().nullable(),
});

export const therapyNoteOptionalFields = {
	otherTherapies: z.string().optional().nullable(),
	objectivesDate: z.string().optional().nullable(),
	reinforcersUsed: z.string().optional().nullable(),
	reinforcersDate: z.string().optional().nullable(),
	familyRecommendations: z.string().optional().nullable(),
	familyRecommendationsDate: z.string().optional().nullable(),
	groupRecommendationParents: z.string().optional().nullable(),
	goalsAchievedDate: z.string().optional().nullable(),
	progressNotesDate: z.string().optional().nullable(),
	nextSessionObjectivesDate: z.string().optional().nullable(),
	incidents: z.string().optional().nullable(),
	incidentsDate: z.string().optional().nullable(),
	generalObservationsDate: z.string().optional().nullable(),
	objectives: z.array(objectiveSchema).optional().default([]),
};
