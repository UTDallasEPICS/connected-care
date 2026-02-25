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

				<p v-if="note.otherTherapies">
					<strong>Other therapies:</strong>
					{{ note.otherTherapies }}
				</p>
				<p v-if="note.reinforcersUsed">
					<strong
						>Reinforcers used
						<span v-if="note.reinforcersDate">
							({{ formatDate(note.reinforcersDate) }}) </span
						>:
					</strong>
					{{ note.reinforcersUsed }}
				</p>
				<p v-if="note.familyRecommendations">
					<strong
						>Recommendations
						<span v-if="note.familyRecommendationsDate">
							({{
								formatDate(note.familyRecommendationsDate)
							}}) </span
						>:
					</strong>
					{{ note.familyRecommendations }}
				</p>
				<p v-if="note.groupRecommendationParents">
					<strong>Group recommendation</strong>
					{{ note.groupRecommendationParents }}
				</p>
				<p v-if="note.goalsAchieved">
					<strong
						>Goals achieved
						<span v-if="note.goalsAchievedDate">
							({{ formatDate(note.goalsAchievedDate) }}) </span
						>:
					</strong>
					{{ note.goalsAchieved }}
				</p>
				<p v-if="note.progressNotes">
					<strong
						>Progress notes
						<span v-if="note.progressNotesDate">
							({{ formatDate(note.progressNotesDate) }}) </span
						>:
					</strong>
					{{ note.progressNotes }}
				</p>
				<p v-if="note.nextSessionObjectives">
					<strong
						>Next session objectives
						<span v-if="note.nextSessionsObjectivesDate">
							({{
								formatDate(note.nextSessionsObjectivesDate)
							}}) </span
						>:
					</strong>
					{{ note.nextSessionObjectives }}
				</p>
				<p v-if="note.incidents">
					<strong
						>Incidents
						<span v-if="note.incidentsDate">
							({{ formatDate(note.incidentsDate) }}) </span
						>:
					</strong>
					{{ note.incidents }}
				</p>
				<p v-if="note.generalObservations">
					<strong
						>General observations
						<span v-if="note.generalObservationsDate">
							({{
								formatDate(note.generalObservationsDate)
							}}) </span
						>:
					</strong>
					{{ note.generalObservations }}
				</p>
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

interface TherapyNote {
	id: number;
	createdAt: string;
	updatedAt?: string;
	therapyType: string;
	objectives?: Array<{
		id: number;
		goalLabel: string;
		details?: string;
	}>;
	objectivesDate?: string;
	otherTherapies?: string;
	reinforcersUsed?: string;
	reinforcersDate?: string;
	familyRecommendations?: string;
	familyRecommendationsDate?: string;
	groupRecommendationParents?: string;
	goalsAchieved?: string;
	goalsAchievedDate?: string;
	progressNotes?: string;
	progressNotesDate?: string;
	nextSessionObjectives?: string;
	nextSessionsObjectivesDate?: string;
	incidents?: string;
	incidentsDate?: string;
	generalObservations?: string;
	generalObservationsDate?: string;
}

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
