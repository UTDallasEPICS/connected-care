<template>
	<div
		v-if="modelValue"
		class="fixed inset-0 z-50 flex items-center justify-center"
		aria-modal="true"
		role="dialog"
	>
		<div
			class="absolute inset-0 bg-black/70"
			@click.self="$emit('update:modelValue', false)"
		></div>

		<div
			class="max-h-9/12 max-w-3/12 relative z-10 w-full overflow-auto rounded bg-white p-6 shadow-md"
			@click.stop
		>
			<h2 class="mb-4 text-xl font-bold">Therapy Note</h2>

			<div v-if="note" class="space-y-3 text-sm">
				<p>
					<strong>Created at:</strong>
					{{ formatDate(note.createdAt) }}
				</p>

				<p v-if="note.updatedAt && note.updatedAt !== note.createdAt">
					<strong>Updated at:</strong>
					{{ formatDate(note.updatedAt) }}
				</p>

				<p>
					<strong>Therapy:</strong>
					{{ therapyTypes[note.therapyType] || note.therapyType }}
				</p>

				<div v-if="note.objectives?.length">
					<strong
						>Objectives worked on
						<span v-if="note.objectivesDate">
							({{ formatDate(note.objectivesDate) }}) </span
						>:
					</strong>
					<ul class="ml-4 list-disc">
						<li v-for="o in note.objectives" :key="o.id">
							<span class="font-semibold">{{ o.goalLabel }}</span>
							<span v-if="o.details"> – {{ o.details }}</span>
						</li>
					</ul>
				</div>

				<template v-for="field in noteFields" :key="field.key">
					<p v-if="note[field.key]">
						<strong>
							{{ field.label }}
							<span v-if="field.dateKey && note[field.dateKey]">
								({{ formatDate(note[field.dateKey]) }})
							</span>:
						</strong>
						{{ note[field.key] }}
					</p>
				</template>
			</div>

			<div class="mt-4 flex justify-end">
				<button
					type="button"
					class="bg-blay px-2 hover:cursor-pointer"
					@click="$emit('update:modelValue', false)"
				>
					Close
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { therapyTypes } from "~/composables/therapy/therapyData";
import type { TherapyNote, NoteField } from "~/types/formTypes";

const noteFields: NoteField[] = [
	{ key: "otherTherapies", label: "Other therapies" },
	{ key: "reinforcersUsed", label: "Reinforcers used", dateKey: "reinforcersDate" },
	{ key: "familyRecommendations", label: "Recommendations", dateKey: "familyRecommendationsDate" },
	{ key: "groupRecommendationParents", label: "Group recommendation" },
	{ key: "goalsAchieved", label: "Goals achieved", dateKey: "goalsAchievedDate" },
	{ key: "progressNotes", label: "Progress notes", dateKey: "progressNotesDate" },
	{ key: "nextSessionObjectives", label: "Next session objectives", dateKey: "nextSessionObjectivesDate" },
	{ key: "incidents", label: "Incidents", dateKey: "incidentsDate" },
	{ key: "generalObservations", label: "General observations", dateKey: "generalObservationsDate" },
];

defineProps<{
	modelValue: boolean;
	note: TherapyNote | null;
}>();

defineEmits<{
	"update:modelValue": [value: boolean];
}>();

function formatDate(value?: string | Date | null) {
	if (!value) return "No date";
	const d = new Date(value);
	if (isNaN(d.getTime())) return "No date";

	return d.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}
</script>
