<template>
	<div class="flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<div class="flex flex-col gap-2">
			<div v-for="(_, i) in entries" :key="i" class="flex flex-row gap-2">
				<input
					v-model="entries[i]"
					type="text"
					class="input w-70 sm:w-full"
					@input="emitUpdate"
				/>
				<button
					type="button"
					class="btn cursor-pointer"
					@click="removeEntry(i)"
				>
					X
				</button>
			</div>
		</div>
		<button
			type="button"
			class="btn mt-2 w-fit cursor-pointer"
			@click="addEntry"
		>
			+ Add
		</button>
	</div>
</template>

<script setup lang="ts">
import type {
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();

const entries = ref<string[]>((model.value as string[]) ?? []);

function emitUpdate() {
	model.value = [...entries.value];
}

function addEntry() {
	entries.value.push("");
	emitUpdate();
}

function removeEntry(i: number) {
	entries.value.splice(i, 1);
	emitUpdate();
}
</script>
