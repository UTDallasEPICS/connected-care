<template>
	<div
		class="font-sc-encode fixed top-0 right-0 z-50 h-full w-full items-center text-left"
	>
		<div class="fixed h-full w-full bg-black/70" @click="closeWindow"></div>

		<div
			class="text-md relative m-7 flex max-h-full flex-col overflow-y-auto bg-white p-4 text-black"
		>
			<div
				class="flex cursor-pointer justify-end pr-2 text-right"
				@click="closeWindow"
			>
				<X :size="30" />
			</div>

			<div class="m-3 flex flex-col gap-3">
				<h1 class="font-cormorant-garamond text-3xl font-bold">
					{{ $t("Filter Appointments") }}
				</h1>
				<h3 class="font-bold">Tick to hide appointment:</h3>
				<div>
					<div v-for="(type, index) in sessionTypes" :key="type.id">
						<input
							:id="`session-type-${type.id}`"
							v-model="filteredTypes[index]"
							type="checkbox"
							:true-value="type.id"
							:false-value="null"
							:checked="oldFilters[index]"
						/>
						<span class="px-2">{{ type.name }}</span>
					</div>
				</div>
			</div>

			<div class="flex flex-col justify-center gap-3">
				<div class="flex justify-center">
					<button class="btn cursor-pointer" @click="submitForm">
						{{ $t("Submit") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, useFetch } from "#imports";
import { computedAsync } from "@vueuse/core";
import { X } from "lucide-vue-next";

type SessionType = {
	id: string;
	name: string;
};

const props = defineProps<{
	filter?: string[];
}>();

const emit = defineEmits(["closeFilterWindow", "addFilters"]);

function closeWindow() {
	emit("closeFilterWindow");
}

const sessionTypes = computedAsync(async () => {
	return await fetchSessionTypes();
}, [] as SessionType[]);

watch(
	() => sessionTypes.value,
	() => {
		oldFilters.value = getOldFilterSettings();
	}
);

const oldFilters = ref(getOldFilterSettings());
const filteredTypes = ref<string[]>([]);

function getOldFilterSettings() {
	const result: boolean[] = [];

	if (!props.filter) {
		return result;
	}

	for (let i = 0; i < sessionTypes.value.length; i++) {
		result.push(props.filter.indexOf(sessionTypes.value[i].id) !== -1);
	}

	return result;
}

async function fetchSessionTypes(): Promise<SessionType[]> {
	const { data } = await useFetch<SessionType[]>("/api/session/types", {
		method: "GET",
		default: () => [],
	});

	return data.value ?? [];
}

function submitForm() {
	const result: string[] = [];

	for (let i = 0; i < filteredTypes.value.length; i++) {
		const value = filteredTypes.value[i];
		if (value !== null && value !== undefined && value !== "") {
			result.push(value);
		}
	}

	emit("addFilters", result);
	closeWindow();
}
</script>
