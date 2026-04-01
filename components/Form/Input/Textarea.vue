<template>
	<div class="flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<textarea
			v-model="text"
			class="input w-full"
			:placeholder="fieldConfig.placeholder"
			:required="fieldConfig.required"
			rows="3"
		></textarea>
	</div>
</template>

<script setup lang="ts">
import type {
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();
const text = computed({
	get: () => (model.value as string) ?? "",
	set: (val: string) => {
		model.value = val;
	},
});
</script>
