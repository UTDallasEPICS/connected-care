// server/api/session/therapyNotes/[id].put.ts
import { defineEventHandler, readBody, getRouterParam } from "h3";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const objectiveSchema = z.object({
	goalKey: z.string().optional().nullable(),
	goalLabel: z.string(),
	details: z.string().optional().nullable(),
});

const therapyNoteUpdateSchema = z.object({
	therapyType: z.string(),

	otherTherapies: z.string().optional().nullable(),

	objectivesDate: z.string().optional().nullable(),

	reinforcersUsed: z.string().optional().nullable(),
	reinforcersDate: z.string().optional().nullable(),

	familyRecommendations: z.string().optional().nullable(),
	familyRecommendationsDate: z.string().optional().nullable(),

	groupRecommendationParents: z.string().optional().nullable(),

	goalsAchieved: z.string().optional().nullable(),
	goalsAchievedDate: z.string().optional().nullable(),

	progressNotes: z.string().optional().nullable(),
	progressNotesDate: z.string().optional().nullable(),

	nextSessionObjectives: z.string().optional().nullable(),
	nextSessionObjectivesDate: z.string().optional().nullable(),

	incidents: z.string().optional().nullable(),
	incidentsDate: z.string().optional().nullable(),

	generalObservations: z.string().optional().nullable(),
	generalObservationsDate: z.string().optional().nullable(),

	objectives: z.array(objectiveSchema).optional().default([]),
});

function parseDateOrNull(value?: string | null): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}

export default defineEventHandler(async (event) => {
	if (event.node.req.method !== "PUT") {
		event.node.res.statusCode = 405;
		return { success: false, error: "Method Not Allowed" };
	}

	const idParam = getRouterParam(event, "id");
	if (!idParam) {
		event.node.res.statusCode = 400;
		return { success: false, error: "Missing note id" };
	}
	const noteId = Number(idParam);

	const rawBody = await readBody(event);
	const parsed = therapyNoteUpdateSchema.safeParse(rawBody);

	if (!parsed.success) {
		event.node.res.statusCode = 400;
		return {
			success: false,
			error: "Bad Request Body",
			details: parsed.error.format(),
		};
	}

	const data = parsed.data;

	// 1) Update note fields
	const note = await prisma.therapyNote.update({
		where: { id: noteId },
		data: {
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

			goalsAchieved: data.goalsAchieved ?? null,
			goalsAchievedDate: parseDateOrNull(data.goalsAchievedDate),

			progressNotes: data.progressNotes ?? null,
			progressNotesDate: parseDateOrNull(data.progressNotesDate),

			nextSessionObjectives: data.nextSessionObjectives ?? null,
			nextSessionObjectivesDate: parseDateOrNull(
				data.nextSessionObjectivesDate
			),

			incidents: data.incidents ?? null,
			incidentsDate: parseDateOrNull(data.incidentsDate),

			generalObservations: data.generalObservations ?? null,
			generalObservationsDate: parseDateOrNull(
				data.generalObservationsDate
			),
		},
	});

	// 2) Replace objectives (simple strategy)
	await prisma.therapyNoteObjective.deleteMany({
		where: { therapyNoteId: noteId },
	});

	if (data.objectives && data.objectives.length > 0) {
		await prisma.therapyNoteObjective.createMany({
			data: data.objectives.map((obj) => ({
				therapyNoteId: noteId,
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
