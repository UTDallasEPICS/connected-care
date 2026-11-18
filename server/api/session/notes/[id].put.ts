import { z } from "zod";
import { AccessPermission } from "~/types/permissions";

const requiredText = (message: string) =>
	z.string({ invalid_type_error: message }).min(1, message).optional();

const therapyNoteUpdateSchema = z.object({
	therapyTypes: z.array(z.string()).min(1),
	// Required columns: omit to keep the current value; null/empty is rejected.
	goalsAchieved: requiredText("Goals Achieved is required"),
	progressNotes: requiredText("Progress Notes is required"),
	nextSessionObjectives: requiredText(
		"Objectives for next session is required"
	),
	generalObservations: requiredText("General Observations is required"),
	...therapyNoteOptionalFields,
});

export default defineAuthedHandler(
	{
		access: [AccessPermission.THERAPIST, AccessPermission.ADMIN],
		ownership: async (event) => {
			if (event.context.permissions[AccessPermission.ADMIN]) {
				return true;
			}

			const idParam = getRouterParam(event, "id");
			if (!idParam) return false;
			const noteId = Number(idParam);
			if (Number.isNaN(noteId)) return false;
			const note = await prisma.therapyNote.findUnique({
				where: { id: noteId },
				select: { patientId: true },
			});
			if (!note) return false;
			return isAssignedTherapist(event, note.patientId);
		},
	},
	async (event) => {
		const idParam = getRouterParam(event, "id");
		if (!idParam) {
			throw createError({
				statusCode: 400,
				statusMessage: "Missing note id",
			});
		}
		const noteId = Number(idParam);

		const data = await validateBody(event, therapyNoteUpdateSchema);

		// 1) Update note fields
		const note = await prisma.therapyNote.update({
			where: { id: noteId },
			data: {
				otherTherapies: data.otherTherapies ?? null,

				objectivesDate: parseDateOrNull(data.objectivesDate),

				reinforcersUsed: data.reinforcersUsed ?? null,
				reinforcersDate: parseDateOrNull(data.reinforcersDate),

				familyRecommendations: data.familyRecommendations ?? null,
				familyRecommendationsDate: parseDateOrNull(
					data.familyRecommendationsDate
				),

				groupRecommendationParents:
					data.groupRecommendationParents ?? null,

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

		// 3) Replace therapy types (same strategy as objectives)
		await prisma.therapyNoteType.deleteMany({
			where: { therapyNoteId: noteId },
		});
		await prisma.therapyNoteType.createMany({
			data: data.therapyTypes.map((therapyType) => ({
				therapyNoteId: noteId,
				therapyType,
			})),
		});

		return {
			success: true,
			data: { ...note, therapyTypes: data.therapyTypes },
		};
	}
);
