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
			class="max-h-9/12 relative z-10 w-full max-w-3xl overflow-auto rounded bg-white p-6 shadow-md"
			@click.stop
		>
			<h2 class="mb-4 text-xl font-bold">Therapist Recommendations</h2>

			<div v-if="recommendations.length" class="space-y-3 text-sm">
				<ul class="ml-5 list-disc">
					<li
						v-for="rec in recommendations"
						:key="rec.id"
						class="cursor-pointer hover:underline"
						@click="$emit('view-recommendation', rec)"
					>
						<strong
							>{{
								formatDate(rec.familyRecommendationsDate)
							}}:</strong
						>
						{{
							rec.familyRecommendations.length > 50
								? rec.familyRecommendations.slice(0, 50) + "..."
								: rec.familyRecommendations
						}}
					</li>
				</ul>
			</div>
			<div v-else>
				<p>No rec available.</p>
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
import type { Recommendation } from "~/types/formTypes";

defineProps<{
	modelValue: boolean;
	recommendations: Recommendation[];
}>();

defineEmits<{
	"update:modelValue": [value: boolean];
	"view-recommendation": [note: Recommendation];
}>();
</script>
