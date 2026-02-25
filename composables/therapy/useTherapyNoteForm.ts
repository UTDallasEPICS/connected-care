import { $fetch } from "ofetch";

export function useTherapyNoteForm() {
	function dateStringWithCurrentTime(
		dateStr: string | null | undefined
	): string | null {
		if (!dateStr) return null;

		// dateStr is "YYYY-MM-DD"
		const parts = dateStr.split("-").map(Number);
		if (parts.length !== 3) return null;

		const [year, month, day] = parts;
		if (!year || !month || !day) return null;

		const now = new Date();

		// Same day as selected date, time = current time
		const combined = new Date(
			year,
			month - 1,
			day,
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
			now.getMilliseconds()
		);

		return combined.toISOString();
	}

	interface ProgressReportFormData {
		selectedTherapy: string;
		selectedObjectives: string[];
		objectiveDetails: Record<string, string>;
		customGoals: Array<{ id: number; label: string; details: string }>;
		objectivesDate: string;
		reinforcersUsed: string;
		reinforcersDate: string;
		familyRecommendations: string;
		familyRecommendationsDate: string;
		groupRecommendationParents: string;
		goalsAchieved: string;
		goalsAchievedDate: string;
		progressNotes: string;
		progressNotesDate: string;
		nextSessionObjectives: string;
		nextSessionObjectivesDate: string;
		incidents: string;
		incidentsDate: string;
		generalObservations: string;
		generalObservationsDate: string;
	}

	async function saveTherapyNote(
		formData: ProgressReportFormData,
		patientId: string | string[],
		noteId: number | null,
		onSuccess: () => Promise<void>
	) {
		const objectivesPayload: {
			goalKey?: string | null;
			goalLabel: string;
			details?: string | null;
		}[] = [];

		// Predefined objectives
		for (const key of formData.selectedObjectives) {
			objectivesPayload.push({
				goalKey: key,
				goalLabel: key,
				details: formData.objectiveDetails[key] || null,
			});
		}

		// Custom goals (only non-empty ones)
		for (const cg of formData.customGoals) {
			if (!cg.label && !cg.details) continue;
			objectivesPayload.push({
				goalKey: null,
				goalLabel: cg.label || "Other",
				details: cg.details || null,
			});
		}

		const payload = {
			patientId,
			therapyType: formData.selectedTherapy,
			objectives: objectivesPayload,
			objectivesDate: dateStringWithCurrentTime(formData.objectivesDate),
			reinforcersUsed: formData.reinforcersUsed || null,
			reinforcersDate: dateStringWithCurrentTime(
				formData.reinforcersDate
			),
			familyRecommendations: formData.familyRecommendations || null,
			familyRecommendationsDate: dateStringWithCurrentTime(
				formData.familyRecommendationsDate
			),
			groupRecommendationParents:
				formData.groupRecommendationParents || null,
			goalsAchieved: formData.goalsAchieved || null,
			goalsAchievedDate: dateStringWithCurrentTime(
				formData.goalsAchievedDate
			),
			progressNotes: formData.progressNotes || null,
			progressNotesDate: dateStringWithCurrentTime(
				formData.progressNotesDate
			),
			nextSessionObjectives: formData.nextSessionObjectives || null,
			nextSessionObjectivesDate: dateStringWithCurrentTime(
				formData.nextSessionObjectivesDate
			),
			incidents: formData.incidents || null,
			incidentsDate: dateStringWithCurrentTime(formData.incidentsDate),
			generalObservations: formData.generalObservations || null,
			generalObservationsDate: dateStringWithCurrentTime(
				formData.generalObservationsDate
			),
		};

		const url = noteId
			? `/api/session/therapyNotes/${noteId}`
			: "/api/session/therapyNotes";

		const method = noteId ? "PUT" : "POST";

		try {
			await $fetch(url, {
				method,
				body: payload,
			});

			await onSuccess();
			return { success: true };
		} catch (err: unknown) {
			console.error("Error saving therapy note:", err);
			const error = err as {
				data?: { error?: string };
				message?: string;
			};
			const fromApi = error?.data?.error;
			const msg = fromApi || error?.message || "Unknown error";
			return { success: false, error: msg };
		}
	}

	return {
		dateStringWithCurrentTime,
		saveTherapyNote,
	};
}
