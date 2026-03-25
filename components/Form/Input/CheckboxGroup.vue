<template>
	<div class="flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<div
			v-if="fieldConfig.checkboxOptions?.length"
			class="max-h-48 space-y-1 overflow-y-auto rounded border p-2"
		>
			<div
				v-for="(item, index) in fieldConfig.checkboxOptions"
				:key="index"
			>
				<div
					v-if="item.header"
					class="mb-1 mt-3 border-b border-gray-300 text-xs font-bold uppercase text-blue-700"
				>
					{{ item.header }}
				</div>
				<div
					v-else-if="item.subheader"
					class="mb-1 mt-2 text-sm font-semibold text-gray-700"
				>
					{{ item.subheader }}
				</div>
				<div v-else class="ml-4 flex items-center gap-2">
					<input
						:id="`cb-${item.value}`"
						v-model="model"
						:value="item.value"
						type="checkbox"
						class="h-4 w-4"
					/>
					<label :for="`cb-${item.value}`" class="text-sm">
						{{ item.label }}
					</label>
				</div>
			</div>
		</div>
		<p v-else class="text-sm text-gray-500">No options available.</p>
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
