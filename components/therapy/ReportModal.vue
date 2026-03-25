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
			class="relative z-10 mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded bg-white p-6 shadow-md"
			@click.stop
		>
			<h2 class="mb-4 text-xl font-bold">Therapy Note</h2>
			<form @submit.prevent="handleSubmit">
				<!-- Custom inputs (therapy select, objective details, custom goals) -->
				<div
					v-for="input in customInputs"
					:key="input.config.name"
					class="mb-4"
				>
					<FormDynamicInput
						v-model="input.model.value"
						:field-config="input.config"
					/>
				</div>

				<!-- Blueprint-driven fields -->
				<div
					v-for="section in therapyFormBlueprint"
					:key="section.sectionTitle"
				>
					<div
						v-for="(row, rowIdx) in section.fields"
						v-show="isRowVisible(row)"
						:key="rowIdx"
						:class="
							row.length > 1
								? 'mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'
								: 'mb-4'
						"
					>
						<FormDynamicInput
							v-for="field in row"
							:key="
								field.dataKey
									? `${field.dataKey}-${field.name}`
									: field.name
							"
							:model-value="getFieldValue(field)"
							:field-config="field"
							@update:model-value="setFieldValue(field, $event)"
						/>
					</div>
				</div>

				<button
					class="bg-smoky mb-4 flex w-full cursor-pointer justify-center"
					type="button"
					@click="$emit('add-question')"
				>
					<Plus />
				</button>

				<div class="flex justify-end space-x-2">
					<button
						type="button"
						class="bg-blay px-2 hover:cursor-pointer"
						@click="$emit('update:modelValue', false)"
					>
						Cancel
					</button>
					<button type="submit" class="btn hover:cursor-pointer">
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { therapyFormBlueprint } from "~/types/FormConfig";
import { useTherapyFormData } from "~/composables/therapy/useTherapyFormData";
import type { TherapyNoteForm } from "~/types/FormConfig/TherapyForms/therapyInfo";

const props = defineProps<{
	modelValue: boolean;
	editingNote?: import("~/types/FormConfig/TherapyForms/therapyInfo").TherapyNote;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
	save: [data: TherapyNoteForm];
	"add-question": [];
}>();

const {
	formData,
	customInputs,
	getFieldValue,
	setFieldValue,
	isRowVisible,
	validate,
} = useTherapyFormData(
	toRef(props, "modelValue"),
	toRef(props, "editingNote") as Ref<
		| import("~/types/FormConfig/TherapyForms/therapyInfo").TherapyNote
		| undefined
	>
);

function handleSubmit() {
	if (!validate()) return;
	emit("save", formData.value);
}
</script>
