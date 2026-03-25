<template>
	<div class="relative flex flex-col">
		<label
			>{{ fieldConfig.label
			}}<span v-if="fieldConfig.required" class="text-red-500"
				>*</span
			></label
		>
		<Listbox
			v-model="model"
			multiple
			as="div"
			class="fill-smoky bg-smoky flex w-40 flex-col overflow-auto sm:w-full"
		>
			<div>
				<ListboxButton
					class="flex w-full cursor-pointer items-start px-2"
				>
					{{
						selectedLabels.length > 0
							? selectedLabels.join(", ")
							: `Select ${fieldConfig.label}:`
					}}
				</ListboxButton>
				<ListboxOptions
					as="div"
					class="bg-blay absolute flex w-full flex-col"
					style="z-index: 20"
				>
					<ListboxOption
						v-for="opt in fieldConfig.options"
						:key="opt.value"
						as="div"
						class="flex w-full cursor-pointer hover:bg-blue-500"
						:value="opt.value"
					>
						<div class="px-5">{{ opt.label }}</div>
					</ListboxOption>
				</ListboxOptions>
			</div>
		</Listbox>
	</div>
</template>

<script setup lang="ts">
import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from "@headlessui/vue";
import type {
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

const props = defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();

const selectedLabels = computed(() => {
	const selected = model.value as string[] | undefined;
	if (!selected || !Array.isArray(selected)) return [];
	return selected.map(
		(v) => props.fieldConfig.options?.find((o) => o.value === v)?.label ?? v
	);
});
</script>
