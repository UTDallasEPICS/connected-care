<template>
	<div>
		<div class="mb-2 flex items-center justify-between">
			<label class="block font-medium">
				{{ fieldConfig.label }}
				<span v-if="fieldConfig.required" class="text-red-500">*</span>
			</label>
			<button
				type="button"
				class="text-sm underline hover:cursor-pointer"
				@click="addGoal"
			>
				+ Add other goal
			</button>
		</div>
		<div v-if="goals.length" class="space-y-3">
			<div
				v-for="cg in goals"
				:key="cg.id"
				class="space-y-2 rounded border p-2"
			>
				<div class="flex items-center gap-2">
					<input
						:value="cg.label"
						type="text"
						class="input w-full"
						placeholder="Goal name (e.g., 'Other: XYZ')"
						@input="
							updateGoal(
								cg.id,
								'label',
								($event.target as HTMLInputElement).value
							)
						"
					/>
					<button
						type="button"
						class="text-xs text-red-600 underline hover:cursor-pointer"
						@click="removeGoal(cg.id)"
					>
						Remove
					</button>
				</div>
				<textarea
					:value="cg.details"
					class="input w-full"
					rows="2"
					placeholder="Details for this other goal"
					@input="
						updateGoal(
							cg.id,
							'details',
							($event.target as HTMLTextAreaElement).value
						)
					"
				></textarea>
			</div>
		</div>
		<p v-else class="text-sm text-gray-500">
			Click "Add other goal" to define custom goals for this therapy.
		</p>
	</div>
</template>

<script setup lang="ts">
import type {
	FormFieldConfig,
	FormFieldValue,
	CustomGoal,
} from "~/types/FormConfig/formConfig";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();

const goals = computed<CustomGoal[]>(() => (model.value as CustomGoal[]) ?? []);

const nextId = ref(1);

watch(
	goals,
	(g) => {
		const maxId = g.reduce((max, cg) => Math.max(max, cg.id), 0);
		if (maxId >= nextId.value) nextId.value = maxId + 1;
	},
	{ immediate: true }
);

function addGoal() {
	model.value = [
		...goals.value,
		{ id: nextId.value++, label: "", details: "" },
	];
}

function removeGoal(id: number) {
	model.value = goals.value.filter((cg) => cg.id !== id);
}

function updateGoal(id: number, field: "label" | "details", val: string) {
	model.value = goals.value.map((cg) =>
		cg.id === id ? { ...cg, [field]: val } : cg
	);
}
</script>
