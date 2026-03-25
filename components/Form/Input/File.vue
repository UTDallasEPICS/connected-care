<template>
	<div class="flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<label>
			<input
				ref="fileInputRef"
				type="file"
				class="btn h-full w-40 cursor-pointer p-2 sm:w-2/5"
				:accept="fieldConfig.accept"
				:multiple="fieldConfig.multiple"
				@change="handleFileChange"
			/>
		</label>
		<div v-if="fileNames.length > 0" class="bg-smoky w-90 sm:w-3/5">
			<div
				v-for="(name, idx) in fileNames"
				:key="idx"
				class="bg-color2 flex flex-col justify-between p-2 md:flex-row"
			>
				<div>{{ name }}</div>
				<button
					type="button"
					class="btn w-1/10 cursor-pointer"
					@click="removeFile(idx)"
				>
					X
				</button>
			</div>
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

const fileInputRef = ref<HTMLInputElement | null>(null);
const fileNames = ref<string[]>([]);
const files = ref<File[]>([]);

function handleFileChange() {
	if (!fileInputRef.value?.files) return;
	const newFiles = Array.from(fileInputRef.value.files);
	for (const file of newFiles) {
		if (!fileNames.value.includes(file.name)) {
			fileNames.value.push(file.name);
			files.value.push(file);
		}
	}
	model.value = [...files.value];
}

function removeFile(idx: number) {
	fileNames.value.splice(idx, 1);
	files.value.splice(idx, 1);
	model.value = [...files.value];
}
</script>
