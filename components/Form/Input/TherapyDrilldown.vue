<template>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="flex flex-col">
			<label class="mb-1 font-medium">
				{{ fieldConfig.label }}
				<span v-if="fieldConfig.required" class="text-red-500">*</span>
			</label>
			<select
				v-model="selectedTherapy"
				class="input w-full"
				:required="fieldConfig.required"
			>
				<option value="" disabled>Select a therapy</option>
				<option
					v-for="(label, key) in therapyTypes"
					:key="key"
					:value="key"
				>
					{{ label }}
				</option>
			</select>
		</div>

		<FormInputCheckboxGroup
			v-if="selectedTherapy"
			v-model="selectedObjectives"
			:field-config="objectivesFieldConfig"
		/>
		<p v-else class="text-sm text-gray-500">
			Select a therapy first to see its objectives.
		</p>
	</div>
</template>

<script setup lang="ts">
import type {
	FormFieldConfig,
	FormFieldValue,
	DrilldownValue,
} from "~/types/FormConfig/formConfig";
import {
	objectivesByTherapy,
	therapyTypes,
} from "~/composables/therapy/therapyData";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();

const drilldown = computed(
	() => (model.value as DrilldownValue) ?? { selected: "", checked: [] }
);

const selectedTherapy = computed({
	get: () => drilldown.value.selected,
	set: (val: string) => {
		model.value = { selected: val, checked: [] };
	},
});

const selectedObjectives = computed({
	get: () => drilldown.value.checked as FormFieldValue,
	set: (val: FormFieldValue) => {
		model.value = {
			selected: drilldown.value.selected,
			checked: val as string[],
		};
	},
});

const objectivesForSelectedTherapy = computed(() => {
	if (!selectedTherapy.value) return [];
	return objectivesByTherapy[selectedTherapy.value] || [];
});

const objectivesFieldConfig = computed<FormFieldConfig>(() => ({
	name: "selectedObjectives",
	label: "Objectives worked on (according to therapy)",
	type: "checkboxgroup",
	required: true,
	checkboxOptions: objectivesForSelectedTherapy.value.map((item) => {
		if (typeof item === "string") return { value: item, label: item };
		if (item.header) return { header: item.header };
		return { subheader: item.subheader };
	}),
}));
</script>
