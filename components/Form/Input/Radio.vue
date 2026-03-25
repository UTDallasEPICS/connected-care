<template>
	<div class="flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<div class="flex flex-row gap-5 text-xl">
			<label v-for="opt in fieldConfig.options" :key="opt.value">
				<input
					v-model="model"
					type="radio"
					:name="fieldConfig.name"
					:value="opt.value"
					:required="fieldConfig.required"
				/>{{ opt.label }}
			</label>
		</div>
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
