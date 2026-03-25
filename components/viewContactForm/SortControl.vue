<template>
	<Listbox
		:model-value="modelValue"
		as="div"
		class="fill-smoky bg-smoky md:w-66 w-2/3"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<div>
			<ListboxButton class="bg-smoky w-full cursor-pointer py-2">
				{{ modelValue == "" ? "Sort By:" : "Sort By: " + modelValue }}
			</ListboxButton>
			<ListboxOptions as="div" class="bg-smoky md:w-66 absolute w-1/5">
				<ListboxOption
					v-for="(option, index) in options"
					:key="index"
					as="div"
					:value="option"
					class="bg-smoky w-full cursor-pointer px-5 hover:bg-blue-500"
				>
					<div>{{ option }}</div>
				</ListboxOption>
			</ListboxOptions>
		</div>
	</Listbox>
</template>

<script setup lang="ts">
import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from "@headlessui/vue";

defineProps<{
	modelValue: string;
	options: string[];
}>();

defineEmits<{
	"update:modelValue": [value: string];
}>();
</script>
