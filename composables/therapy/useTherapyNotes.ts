import { ref, computed } from "vue";
import { $fetch } from "ofetch";
import type { TherapyNote } from "~/types/formTypes";

interface TherapyNotesResponse {
	data?: TherapyNote[];
}

export function useTherapyNotes(patientId: string | string[]) {
	const therapyNotes = ref<TherapyNote[]>([]);

	async function loadTherapyNotes() {
		const res = await $fetch<TherapyNotesResponse>(
			"/api/session/therapyNotes",
			{
				method: "GET",
				params: { patientId },
			}
		);
		const data = res.data;
		therapyNotes.value = data || [];
	}

	const editingNoteId = ref<number | null>(null);

	const editingNote = computed(() => {
		if (!editingNoteId.value) return null;
		return (
			therapyNotes.value.find((n) => n.id === editingNoteId.value) || null
		);
	});

	function openNewTherapyNote() {
		editingNoteId.value = null;
	}

	function openEditTherapyNote(note: { id: number }) {
		editingNoteId.value = note.id;
	}

	return {
		therapyNotes,
		loadTherapyNotes,
		editingNoteId,
		editingNote,
		openNewTherapyNote,
		openEditTherapyNote,
	};
}
