<template>
	<div class="flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<input
			v-model="model"
			type="date"
			class="input no-calendar w-full sm:w-28"
			:required="fieldConfig.required"
		/>
	</div>
</template>

<script setup lang="ts">
import type {
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();
</script>
