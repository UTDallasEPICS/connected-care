<template>
	<!-- Therapy Notes history -->
	<TherapyNotesHistory
		v-if="can('THERAPIST')"
		:notes="therapyNotes"
		@open-note="handleOpenNote"
		@edit-note="handleEditNote"
	/>

	<!-- Modals -->
	<RecommendationsModal
		v-model="modals.recommendations"
		:recommendations="recommendations"
		@view-recommendation="viewRecommendation"
	/>

	<TherapyReportModal
		v-model="modals.progressReport"
		:patient-id="patientId"
		:editing-note="editingNote ?? undefined"
		@save="handleProgressReportSave"
	/>

	<TherapyViewNoteModal v-model="modals.viewNote" :note="activeNote" />
</template>

<script setup lang="ts">
import type { TherapyNote } from "~/types/formTypes";

interface Recommendation {
	id: number;
	familyRecommendations: string;
	familyRecommendationsDate: string;
}

const props = defineProps<{
	patientId: string;
}>();

const { can } = useAccess();
const {
	therapyNotes,
	loadTherapyNotes,
	editingNoteId,
	editingNote,
	openNewTherapyNote,
	openEditTherapyNote,
} = useTherapyNotes(props.patientId);
const { saveTherapyNote } = useTherapyNoteForm();
const { modals, openModal, closeModal } = useModalToggle(
	"recommendations",
	"progressReport",
	"viewNote"
);

const activeNote = ref<TherapyNote | null>(null);
const recommendations = ref<Recommendation[]>([]);

// --- Init ---
loadTherapyNotes();

// --- Exposed for parent to call ---
function openRecommendationsModal() {
	recommendations.value = therapyNotes.value
		.filter((note) => note.familyRecommendations)
		.sort(
			(a, b) =>
				new Date(String(b.familyRecommendationsDate)).getTime() -
				new Date(String(a.familyRecommendationsDate)).getTime()
		)
		.map((note) => ({
			id: note.id,
			familyRecommendations: String(note.familyRecommendations),
			familyRecommendationsDate: String(note.familyRecommendationsDate),
		}));
	openModal("recommendations");
}

function handleNewNote() {
	openNewTherapyNote();
	openModal("progressReport");
}

defineExpose({ openRecommendationsModal, handleNewNote });

// --- Internal handlers ---
function viewRecommendation(note: Recommendation) {
	const fullNote = therapyNotes.value.find((n) => n.id === note.id);
	if (fullNote) handleOpenNote(fullNote);
	closeModal("recommendations");
}

function handleOpenNote(note: TherapyNote) {
	activeNote.value = note;
	openModal("viewNote");
}

function handleEditNote(note: TherapyNote) {
	openEditTherapyNote(note);
	openModal("progressReport");
}

async function handleProgressReportSave(formData: Record<string, unknown>) {
	const result = await saveTherapyNote(
		formData,
		props.patientId,
		editingNoteId.value,
		async () => {
			await loadTherapyNotes();
		}
	);

	if (result.success) {
		closeModal("progressReport");
		editingNoteId.value = null;
	} else {
		alert("Could not save therapy note: " + result.error);
	}
}
</script>
