// server/api/session/therapyNotes.post.ts
import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import { prisma } from "~/server/utils/prisma";

const objectiveSchema = z.object({
	goalKey: z.string().optional().nullable(), // predefined key
	goalLabel: z.string(), // display label
	details: z.string().optional().nullable(),
});

const therapyNoteSchema = z.object({
	patientId: z.string(),

	therapyType: z.string(),

	otherTherapies: z.string().optional().nullable(),

	objectivesDate: z.string().optional().nullable(),

	reinforcersUsed: z.string().optional().nullable(),
	reinforcersDate: z.string().optional().nullable(),

	familyRecommendations: z.string().optional().nullable(),
	familyRecommendationsDate: z.string().optional().nullable(),

	groupRecommendationParents: z.string().optional().nullable(),

	goalsAchieved: z.string().min(1, "Goals Achived is required"),
	goalsAchievedDate: z.string().optional().nullable(),

	progressNotes: z.string().min(1, "Progress Notes is required"),
	progressNotesDate: z.string().optional().nullable(),

	nextSessionObjectives: z
		.string()
		.min(1, "Objectives fro next session is required "),
	nextSessionObjectivesDate: z.string().optional().nullable(),

	incidents: z.string().optional().nullable(),
	incidentsDate: z.string().optional().nullable(),

	generalObservations: z.string().min(1, "General Observations is required"),
	generalObservationsDate: z.string().optional().nullable(),

	objectives: z.array(objectiveSchema).optional().default([]),
});

function parseDateOrNull(value?: string | null): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}

export default defineEventHandler(async (event) => {
	if (event.node.req.method !== "POST") {
		event.node.res.statusCode = 405;
		return { success: false, error: "Method Not Allowed" };
	}

	const rawBody = await readBody(event);
	const parsed = therapyNoteSchema.safeParse(rawBody);

	if (!parsed.success) {
		event.node.res.statusCode = 400;
		return {
			success: false,
			error: "Bad Request Body",
			details: parsed.error.format(),
		};
	}

	const data = parsed.data;
	// at least one objective required
	if (!data.objectives || data.objectives.length === 0) {
		event.node.res.statusCode = 400;
		return {
			success: false,
			error: "At least one objective or custom goal is required.",
		};
	}

	// 1) Create TherapyNote
	const note = await prisma.therapyNote.create({
		data: {
			patientId: data.patientId,
			therapyType: data.therapyType,

			otherTherapies: data.otherTherapies ?? null,

			objectivesDate: parseDateOrNull(data.objectivesDate),

			reinforcersUsed: data.reinforcersUsed ?? null,
			reinforcersDate: parseDateOrNull(data.reinforcersDate),

			familyRecommendations: data.familyRecommendations ?? null,
			familyRecommendationsDate: parseDateOrNull(
				data.familyRecommendationsDate
			),

			groupRecommendationParents: data.groupRecommendationParents ?? null,

			goalsAchieved: data.goalsAchieved,
			goalsAchievedDate: parseDateOrNull(data.goalsAchievedDate),

			progressNotes: data.progressNotes,
			progressNotesDate: parseDateOrNull(data.progressNotesDate),

			nextSessionObjectives: data.nextSessionObjectives,
			nextSessionObjectivesDate: parseDateOrNull(
				data.nextSessionObjectivesDate
			),

			incidents: data.incidents ?? null,
			incidentsDate: parseDateOrNull(data.incidentsDate),

			generalObservations: data.generalObservations,
			generalObservationsDate: parseDateOrNull(
				data.generalObservationsDate
			),
		},
	});

	// 2) Create multiple objectives
	if (data.objectives && data.objectives.length > 0) {
		await prisma.therapyNoteObjective.createMany({
			data: data.objectives.map((obj) => ({
				therapyNoteId: note.id,
				goalKey: obj.goalKey ?? null,
				goalLabel: obj.goalLabel,
				details: obj.details ?? null,
			})),
		});
	}

	return {
		success: true,
		data: note,
	};
});
