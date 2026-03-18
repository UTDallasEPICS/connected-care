<template>
	<section class="mt-6 rounded border p-4">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-xl font-semibold">Therapy Notes</h2>
		</div>

		<div v-if="!notes.length" class="text-sm text-gray-500">
			No therapy notes recorded yet.
		</div>

		<div
			v-for="note in notes"
			:key="note.id"
			class="mt-3 rounded border p-3"
		>
			<!-- Header row -->
			<div class="flex items-center justify-between">
				<div>
					<div class="font-semibold">
						Created: {{ formatDate(note.createdAt) }}
					</div>

					<div
						v-if="note.updatedAt !== note.createdAt"
						class="text-xs text-gray-500"
					>
						Updated: {{ formatDate(note.updatedAt) }}
					</div>
					<div class="text-sm text-gray-600">
						{{
							therapyTypes[note.therapyType] ||
							note.therapyType
						}}
					</div>
				</div>

				<div class="space-x-2 text-sm">
					<button
						class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
						@click="$emit('open-note', note)"
					>
						Open
					</button>
					<button
						class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
						@click="$emit('edit-note', note)"
					>
						Edit
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { therapyTypes } from "~/composables/therapy/therapyData";
import type { TherapyNote } from "~/types/formTypes";

defineProps<{
	notes: TherapyNote[];
}>();

defineEmits<{
	"open-note": [note: TherapyNote];
	"edit-note": [note: TherapyNote];
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
