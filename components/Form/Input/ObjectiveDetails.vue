<template>
	<div>
		<label class="mb-1 block font-medium">
			{{ fieldConfig.label }}
			<span v-if="fieldConfig.required" class="text-red-500">*</span>
		</label>
		<div v-if="value.objectives.length" class="space-y-3">
			<div
				v-for="objectiveKey in value.objectives"
				:key="objectiveKey"
				class="space-y-1 rounded border p-2"
			>
				<div class="text-sm font-semibold">
					{{ objectiveKey }}
				</div>
				<textarea
					:value="value.details[objectiveKey] ?? ''"
					:placeholder="`Details for: ${objectiveKey}`"
					class="input w-full"
					rows="2"
					@input="
						updateDetail(
							objectiveKey,
							($event.target as HTMLTextAreaElement).value
						)
					"
				></textarea>
			</div>
		</div>
		<p v-else class="text-sm text-gray-500">
			Select at least one objective above.
		</p>
		<div class="mt-3">
			<label class="mb-1 block font-medium">Date</label>
			<input
				:value="value.date"
				type="date"
				class="input w-full md:w-1/3"
				@input="updateDate(($event.target as HTMLInputElement).value)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {
	FormFieldConfig,
	FormFieldValue,
	ObjectiveDetailsValue,
} from "~/types/FormConfig/formConfig";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();

const value = computed<ObjectiveDetailsValue>(
	() =>
		(model.value as ObjectiveDetailsValue) ?? {
			objectives: [],
			details: {},
			date: "",
		}
);

function updateDetail(key: string, val: string) {
	model.value = {
		...value.value,
		details: { ...value.value.details, [key]: val },
	};
}

function updateDate(date: string) {
	model.value = { ...value.value, date };
}
</script>
