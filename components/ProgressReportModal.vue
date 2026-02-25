<template>
	<div
		v-if="modelValue"
		class="fixed inset-0 z-50 flex items-center justify-center"
		aria-modal="true"
		role="dialog"
	>
		<!-- Dimmed Background -->
		<div
			class="absolute inset-0 bg-black/70"
			@click.self="$emit('update:modelValue', false)"
		></div>

		<!-- Modal Content -->
		<div
			class="max-h-9/12 max-w-9/12 relative z-10 w-full overflow-auto rounded bg-white p-6 shadow-md"
			@click.stop
		>
			<h2 class="mb-4 text-xl font-bold">Therapy Note</h2>
			<form @submit.prevent="handleSubmit">
				<!-- Therapy + Objectives worked on (drill down) -->
				<div class="mb-4 grid gap-4 md:grid-cols-2">
					<!-- Therapy -->
					<div>
						<label class="mb-1 block font-medium">
							Therapy (drill down)
							<span class="text-red-500">*</span>
						</label>
						<select
							v-model="formData.selectedTherapy"
							class="input w-full"
							required
							@change="handleTherapyChange"
						>
							<option value="" disabled>Select a therapy</option>
							<option
								v-for="(label, key) in therapyTypes"
								:key="key"
								:value="key"
							>
								{{ label }}
							</option>
						</select>
					</div>

					<!-- Objectives worked on: multi-select via checkboxes -->
					<div>
						<label class="mb-1 block font-medium">
							Objectives worked on (according to therapy)
							<span class="text-red-500">*</span>
						</label>

						<div
							v-if="
								objectivesForSelectedTherapy.length &&
								formData.selectedTherapy
							"
							class="max-h-48 space-y-1 overflow-y-auto rounded border p-2"
						>
							<div
								v-for="(
									item, index
								) in objectivesForSelectedTherapy"
								:key="index"
							>
								<!-- SECTION HEADER -->
								<div
									v-if="item.header"
									class="mb-1 mt-3 border-b border-gray-300 text-xs font-bold uppercase text-blue-700"
								>
									{{ item.header }}
								</div>

								<!-- SUB-SECTION LABEL -->
								<div
									v-else-if="item.subheader"
									class="mb-1 mt-2 text-sm font-semibold text-gray-700"
								>
									{{ item.subheader }}
								</div>

								<!-- ACTUAL CHECKBOX OBJECTIVE -->
								<div
									v-else
									class="ml-4 flex items-center gap-2"
								>
									<input
										:id="`obj-${item}`"
										v-model="formData.selectedObjectives"
										:value="item"
										type="checkbox"
										class="h-4 w-4"
									/>
									<label :for="`obj-${item}`" class="text-sm">
										{{ item }}
									</label>
								</div>
							</div>
						</div>
						<p v-else class="text-sm text-gray-500">
							Select a therapy first to see its objectives.
						</p>
					</div>
				</div>

				<!-- Objectives details + date -->
				<div class="mb-4">
					<label class="mb-1 block font-medium">
						Objectives worked on - details
					</label>

					<!-- One textarea per selected predefined objective -->
					<div
						v-if="formData.selectedObjectives.length"
						class="space-y-3"
					>
						<div
							v-for="objectiveKey in formData.selectedObjectives"
							:key="objectiveKey"
							class="space-y-1 rounded border p-2"
						>
							<div class="text-sm font-semibold">
								{{ objectiveKey }}
							</div>
							<textarea
								v-model="
									formData.objectiveDetails[objectiveKey]
								"
								:placeholder="`Details for: ${objectiveKey}`"
								class="input w-full"
								rows="2"
							></textarea>
						</div>
					</div>

					<p v-else class="text-sm text-gray-500">
						Select at least one objective above.
					</p>

					<!-- Date for objectives block -->
					<div class="mt-3">
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.objectivesDate"
							type="date"
							class="input w-full md:w-1/3"
						/>
					</div>
				</div>

				<!-- Other / custom goals -->
				<div class="mb-4">
					<div class="mb-2 flex items-center justify-between">
						<label class="block font-medium"> Other goal(s) </label>
						<button
							type="button"
							class="text-sm underline hover:cursor-pointer"
							@click="addCustomGoal"
						>
							+ Add other goal
						</button>
					</div>

					<div v-if="formData.customGoals.length" class="space-y-3">
						<div
							v-for="cg in formData.customGoals"
							:key="cg.id"
							class="space-y-2 rounded border p-2"
						>
							<div class="flex items-center gap-2">
								<input
									v-model="cg.label"
									type="text"
									class="input w-full"
									placeholder="Goal name (e.g., 'Other: XYZ')"
								/>
								<button
									type="button"
									class="text-xs text-red-600 underline hover:cursor-pointer"
									@click="removeCustomGoal(cg.id)"
								>
									Remove
								</button>
							</div>
							<textarea
								v-model="cg.details"
								class="input w-full"
								rows="2"
								placeholder="Details for this other goal"
							></textarea>
						</div>
					</div>
					<p v-else class="text-sm text-gray-500">
						Click "Add other goal" to define custom goals for this
						therapy.
					</p>
				</div>

				<!-- Reinforcers used + Date -->
				<div
					class="mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							Reinforcers used (if applicable)
						</label>
						<textarea
							v-model="formData.reinforcersUsed"
							class="input w-full"
							rows="2"
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.reinforcersDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<!-- Recommendations for the family and/or user + Date -->
				<div
					class="mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							Recommendations for the family and/or user
						</label>
						<textarea
							v-model="formData.familyRecommendations"
							class="input w-full"
							rows="3"
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.familyRecommendationsDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<!-- Group recommendation for parents (Independent Living, etc.) -->
				<div
					v-if="formData.selectedTherapy === 'INDEPENDENT_LIVING'"
					class="mb-4"
				>
					<label class="mb-1 block font-medium">
						Group recommendation for parents
					</label>
					<textarea
						v-model="formData.groupRecommendationParents"
						class="input w-full"
						rows="3"
						placeholder="Group recommendation directed to parents"
					></textarea>
				</div>

				<!-- Goals achieved + Date -->
				<div
					class="mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							Goals achieved
							<span class="text-red-500">*</span>
						</label>
						<textarea
							v-model="formData.goalsAchieved"
							class="input w-full"
							rows="3"
							required
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.goalsAchievedDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<!-- Progress notes + Date -->
				<div
					class="mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							Progress notes (what happened in therapy)
							<span class="text-red-500">*</span>
						</label>
						<textarea
							v-model="formData.progressNotes"
							class="input w-full"
							rows="4"
							required
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.progressNotesDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<!-- Objectives for next therapy session + Date -->
				<div
					class="mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							Objectives for next therapy session
							<span class="text-red-500">*</span>
						</label>
						<textarea
							v-model="formData.nextSessionObjectives"
							class="input w-full"
							rows="3"
							required
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.nextSessionObjectivesDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<!-- Incidents + Date -->
				<div
					class="mb-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							Incidents (if applicable)
						</label>
						<textarea
							v-model="formData.incidents"
							class="input w-full"
							rows="3"
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.incidentsDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<!-- General observations + Date -->
				<div
					class="mb-6 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div>
						<label class="mb-1 block font-medium">
							General observations
						</label>
						<textarea
							v-model="formData.generalObservations"
							class="input w-full"
							rows="3"
							required
						></textarea>
					</div>
					<div>
						<label class="mb-1 block font-medium"> Date </label>
						<input
							v-model="formData.generalObservationsDate"
							type="date"
							class="input w-full"
						/>
					</div>
				</div>

				<button
					class="bg-smoky mb-4 flex w-full cursor-pointer justify-center"
					type="button"
					@click="$emit('add-question')"
				>
					<Plus />
				</button>

				<!-- Action Buttons -->
				<div class="flex justify-end space-x-2">
					<button
						type="button"
						class="bg-blay px-2 hover:cursor-pointer"
						@click="$emit('update:modelValue', false)"
					>
						Cancel
					</button>
					<button type="submit" class="btn hover:cursor-pointer">
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
	objectivesByTherapy,
	therapyTypes,
} from "~/composables/therapy/therapyData";
import { Plus } from "lucide-vue-next";

interface CustomGoal {
	id: number;
	label: string;
	details: string;
}

interface FormData {
	selectedTherapy: string;
	selectedObjectives: string[];
	objectiveDetails: Record<string, string>;
	customGoals: CustomGoal[];
	objectivesDate: string;
	reinforcersUsed: string;
	reinforcersDate: string;
	familyRecommendations: string;
	familyRecommendationsDate: string;
	groupRecommendationParents: string;
	goalsAchieved: string;
	goalsAchievedDate: string;
	progressNotes: string;
	progressNotesDate: string;
	nextSessionObjectives: string;
	nextSessionObjectivesDate: string;
	incidents: string;
	incidentsDate: string;
	generalObservations: string;
	generalObservationsDate: string;
}

interface TherapyNote {
	id: number;
	therapyType?: string;
	objectivesDate?: string;
	reinforcersUsed?: string;
	reinforcersDate?: string;
	familyRecommendations?: string;
	familyRecommendationsDate?: string;
	groupRecommendationParents?: string;
	goalsAchieved?: string;
	goalsAchievedDate?: string;
	progressNotes?: string;
	progressNotesDate?: string;
	nextSessionObjectives?: string;
	nextSessionObjectivesDate?: string;
	incidents?: string;
	incidentsDate?: string;
	generalObservations?: string;
	generalObservationsDate?: string;
	objectives?: Array<{
		goalKey?: string | null;
		goalLabel?: string;
		details?: string | null;
	}>;
}

const props = defineProps<{
	modelValue: boolean;
	editingNote?: TherapyNote;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
	save: [data: FormData];
	"add-question": [];
}>();

let nextCustomGoalId = 1;

const formData = ref<FormData>({
	selectedTherapy: "",
	selectedObjectives: [],
	objectiveDetails: {},
	customGoals: [],
	objectivesDate: "",
	reinforcersUsed: "",
	reinforcersDate: "",
	familyRecommendations: "",
	familyRecommendationsDate: "",
	groupRecommendationParents: "",
	goalsAchieved: "",
	goalsAchievedDate: "",
	progressNotes: "",
	progressNotesDate: "",
	nextSessionObjectives: "",
	nextSessionObjectivesDate: "",
	incidents: "",
	incidentsDate: "",
	generalObservations: "",
	generalObservationsDate: "",
});

const objectivesForSelectedTherapy = computed(() => {
	if (!formData.value.selectedTherapy) return [];
	return objectivesByTherapy[formData.value.selectedTherapy] || [];
});

function handleTherapyChange() {
	formData.value.selectedObjectives = [];
	formData.value.objectiveDetails = {};
}

function addCustomGoal() {
	formData.value.customGoals.push({
		id: nextCustomGoalId++,
		label: "",
		details: "",
	});
}

function removeCustomGoal(id: number) {
	formData.value.customGoals = formData.value.customGoals.filter(
		(cg) => cg.id !== id
	);
}

function resetForm() {
	formData.value = {
		selectedTherapy: "",
		selectedObjectives: [],
		objectiveDetails: {},
		customGoals: [],
		objectivesDate: "",
		reinforcersUsed: "",
		reinforcersDate: "",
		familyRecommendations: "",
		familyRecommendationsDate: "",
		groupRecommendationParents: "",
		goalsAchieved: "",
		goalsAchievedDate: "",
		progressNotes: "",
		progressNotesDate: "",
		nextSessionObjectives: "",
		nextSessionObjectivesDate: "",
		incidents: "",
		incidentsDate: "",
		generalObservations: "",
		generalObservationsDate: "",
	};
	nextCustomGoalId = 1;
}

function handleSubmit() {
	// Validation
	if (!formData.value.selectedTherapy) {
		alert("Please select a therapy.");
		return;
	}

	if (!formData.value.goalsAchieved?.trim()) {
		alert("Goals Achieved is required.");
		return;
	}

	if (!formData.value.progressNotes?.trim()) {
		alert("Progress Notes is required.");
		return;
	}

	if (!formData.value.nextSessionObjectives?.trim()) {
		alert("Objectives for next session is required.");
		return;
	}

	const hasPredefinedObjectives =
		formData.value.selectedObjectives.length > 0;
	const hasNonEmptyCustomGoals = formData.value.customGoals.some(
		(g) =>
			(g.label && g.label.trim() !== "") ||
			(g.details && g.details.trim() !== "")
	);

	if (!hasPredefinedObjectives && !hasNonEmptyCustomGoals) {
		alert("Please select at least one objective or add another goal.");
		return;
	}

	emit("save", formData.value);
}

watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal) {
			if (props.editingNote) {
				// Populate form with editing note data
				formData.value.selectedTherapy =
					props.editingNote.therapyType || "";
				formData.value.objectivesDate = props.editingNote.objectivesDate
					? props.editingNote.objectivesDate.slice(0, 10)
					: "";
				formData.value.reinforcersUsed =
					props.editingNote.reinforcersUsed || "";
				formData.value.reinforcersDate = props.editingNote
					.reinforcersDate
					? props.editingNote.reinforcersDate.slice(0, 10)
					: "";
				formData.value.familyRecommendations =
					props.editingNote.familyRecommendations || "";
				formData.value.familyRecommendationsDate = props.editingNote
					.familyRecommendationsDate
					? props.editingNote.familyRecommendationsDate.slice(0, 10)
					: "";
				formData.value.goalsAchieved =
					props.editingNote.goalsAchieved || "";
				formData.value.goalsAchievedDate = props.editingNote
					.goalsAchievedDate
					? props.editingNote.goalsAchievedDate.slice(0, 10)
					: "";
				formData.value.progressNotes =
					props.editingNote.progressNotes || "";
				formData.value.progressNotesDate = props.editingNote
					.progressNotesDate
					? props.editingNote.progressNotesDate.slice(0, 10)
					: "";
				formData.value.nextSessionObjectives =
					props.editingNote.nextSessionObjectives || "";
				formData.value.nextSessionObjectivesDate = props.editingNote
					.nextSessionObjectivesDate
					? props.editingNote.nextSessionObjectivesDate.slice(0, 10)
					: "";
				formData.value.incidents = props.editingNote.incidents || "";
				formData.value.incidentsDate = props.editingNote.incidentsDate
					? props.editingNote.incidentsDate.slice(0, 10)
					: "";
				formData.value.generalObservations =
					props.editingNote.generalObservations || "";
				formData.value.generalObservationsDate = props.editingNote
					.generalObservationsDate
					? props.editingNote.generalObservationsDate.slice(0, 10)
					: "";
				formData.value.groupRecommendationParents =
					props.editingNote.groupRecommendationParents || "";

				formData.value.selectedObjectives = [];
				formData.value.objectiveDetails = {};
				formData.value.customGoals = [];

				if (
					props.editingNote.objectives &&
					Array.isArray(props.editingNote.objectives)
				) {
					for (const obj of props.editingNote.objectives) {
						if (obj.goalKey) {
							if (
								!formData.value.selectedObjectives.includes(
									obj.goalKey
								)
							) {
								formData.value.selectedObjectives.push(
									obj.goalKey
								);
							}
							formData.value.objectiveDetails[obj.goalKey] =
								obj.details || "";
						} else {
							formData.value.customGoals.push({
								id: nextCustomGoalId++,
								label: obj.goalLabel || "Other",
								details: obj.details || "",
							});
						}
					}
				}
			} else {
				resetForm();
			}
		} else {
			resetForm();
		}
	}
);
</script>
