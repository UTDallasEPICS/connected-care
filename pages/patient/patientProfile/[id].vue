<template>
	<div class="font-sc-encode p-4">
		<!-- Dashboard Header -->
		<div class="mb-4 flex flex-row items-center">
			<h1 class="font-cormorant-garamond text-nowrap text-3xl font-bold">
				User Profile
			</h1>
			<!-- Edit Profile Button -->
			<div class="w-full"></div>
			<button
				v-if="access[AccessPermission.PATIENT]"
				class="btn text-nowrap hover:cursor-pointer"
				@click="openEditModal"
			>
				Edit Profile
			</button>

			<!-- Therapist Recommendations Button -->
			<button
				v-if="access[AccessPermission.PATIENT]"
				class="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
				@click="openRecommendationsModal"
			>
				Therapist Recommendations
			</button>

			<button
				v-if="access[AccessPermission.THERAPIST]"
				class="btn text-nowrap hover:cursor-pointer"
				@click="openNewTherapyNote"
			>
				Write Therapy Notes
			</button>
		</div>

		<!-- Patient / Parent Section -->
		<section class="mb-6 rounded border p-4">
			<h2 class="mb-2 text-xl font-semibold">Profile Details</h2>

			<p class="mb-2">
				<strong>User's full name:</strong>
				{{ profile.fName }} {{ profile.mInit }} {{ profile.lName }}
			</p>

			<p class="mb-2">
				<strong>User's age:</strong>
				{{ age || "-" }}
			</p>

			<p class="mb-2">
				<strong>Date of birth:</strong>
				{{
					profile?.NonEmployee?.dob
						? new Date(profile.NonEmployee.dob).toDateString()
						: "-"
				}}
			</p>

			<p class="mb-2">
				<strong>Diagnosis:</strong>
				{{ profile?.NonEmployee?.Patient?.diagnosis || "—" }}
			</p>

			<p class="mb-2">
				<strong>Record number:</strong>
				{{ profile?.NonEmployee?.Patient?.recordNumber || "—" }}
			</p>

			<p class="mb-2">
				<strong>Sex:</strong>
				{{ profile?.NonEmployee?.gender || "—" }}
			</p>

			<p class="mb-2">
				<strong>Medication:</strong>
				{{ profile?.NonEmployee?.Patient?.medication || "—" }}
			</p>

			<p class="mb-2">
				<strong>Allergies:</strong>
				{{ profile?.NonEmployee?.Patient?.allergies || "—" }}
			</p>

			<p class="mb-2">
				<strong>Diet:</strong>
				{{ profile?.NonEmployee?.Patient?.diet || "—" }}
			</p>

			<p class="mb-2">
				<strong>Parent/Guardian's name:</strong>
				{{ profile?.NonEmployee?.Patient?.parentName || "—" }}
			</p>

			<!-- Keep the existing contact + address block for non-therapists -->
			<div v-if="!access[AccessPermission.THERAPIST]">
				<p class="mb-2"><strong>Email:</strong> {{ profile.email }}</p>
				<p class="mb-2"><strong>Phone:</strong> {{ profile.phone }}</p>
				<p class="mb-2">
					<strong>What's App:</strong> {{ profile.whatsApp }}
				</p>
				<p class="mb-2">
					<strong>Contact Preference:</strong>
					{{ profile.contactPref }}
				</p>
				<div class="mb-2 mt-8">
					<strong>Address:</strong>
					<div class="pl-12">
						<div v-if="profile?.NonEmployee?.buildingNum">
							{{ profile?.NonEmployee?.streetNum }}
							{{ profile?.NonEmployee?.streetName }},
							{{ profile?.NonEmployee?.buildingNum }}
						</div>
						<div v-else>
							{{ profile?.NonEmployee?.streetNum }}
							{{ profile?.NonEmployee?.streetName }}
							{{ profile?.NonEmployee?.buildingNum }}
						</div>
						<div>
							{{ profile?.NonEmployee?.PostCodeCity?.city }},
							{{ profile?.NonEmployee?.postCode }}
						</div>
					</div>
				</div>
			</div>

			<p class="mb-2 mt-8">
				<strong>Diagnosed?</strong>
				{{ profile?.NonEmployee?.Patient?.diagnosed }}
			</p>
			<p v-if="!access[AccessPermission.THERAPIST]" class="mb-2">
				<strong>All Sessions Paid?</strong>
				{{ paid }}
			</p>
		</section>

		<!-- Therapy Notes history – visible only to therapists -->
		<section
			v-if="access[AccessPermission.THERAPIST]"
			class="mt-6 rounded border p-4"
		>
			<div class="mb-2 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Therapy Notes</h2>
			</div>

			<div v-if="!therapyNotes.length" class="text-sm text-gray-500">
				No therapy notes recorded yet.
			</div>

			<div
				v-for="note in therapyNotes"
				:key="note.id"
				class="mt-3 rounded border p-3"
			>
				<!-- Header row -->
				<div class="flex items-center justify-between">
					<div>
						<div class="font-semibold">
							Created: {{ formatDate(note.createdAt) }}
						</div>

						<div
							v-if="note.updatedAt !== note.createdAt"
							class="text-xs text-gray-500"
						>
							Updated: {{ formatDate(note.updatedAt) }}
						</div>
						<div class="text-sm text-gray-600">
							{{
								therapyTypes[note.therapyType] ||
								note.therapyType
							}}
						</div>
					</div>

					<div class="space-x-2 text-sm">
						<button
							class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
							@click="openViewTherapyNote(note)"
						>
							Open
						</button>
						<button
							class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
							@click="openEditTherapyNote(note)"
						>
							Edit
						</button>
					</div>
				</div>
			</div>
		</section>

		<TherapistRecommendationsModal
			v-model="showRecommendationsModal"
			:recommendations="recommendations"
			@view-recommendation="viewRecommendation"
		/>

		<EditProfileModal
			v-model="showEditModal"
			:profile="profile"
			@save="handleEditProfileSave"
		/>

		<ProgressReportModal
			v-model="showProgressReportModal"
			:patient-id="uId"
			:editing-note="editingNote"
			@save="handleProgressReportSave"
			@add-question="addQuestion"
		/>

		<!-- ================= MODAL: View Therapy Note ================= -->
		<div
			v-if="showViewNoteModal"
			class="fixed inset-0 z-50 flex items-center justify-center"
			aria-modal="true"
			role="dialog"
		>
			<div
				class="absolute inset-0 bg-black/70"
				@click.self="closeViewNoteModal"
			></div>

			<div
				class="max-h-9/12 max-w-3/12 relative z-10 w-full overflow-auto rounded bg-white p-6 shadow-md"
				@click.stop
			>
				<h2 class="mb-4 text-xl font-bold">Therapy Note</h2>

				<div v-if="activeNote" class="space-y-3 text-sm">
					<p>
						<strong>Created at:</strong>
						{{ formatDate(activeNote.createdAt) }}
					</p>

					<p
						v-if="
							activeNote.updatedAt &&
							activeNote.updatedAt !== activeNote.createdAt
						"
					>
						<strong>Updated at:</strong>
						{{ formatDate(activeNote.updatedAt) }}
					</p>

					<p>
						<strong>Therapy:</strong>
						{{
							therapyTypes[activeNote.therapyType] ||
							activeNote.therapyType
						}}
					</p>

					<div v-if="activeNote.objectives?.length">
						<strong
							>Objectives worked on
							<span v-if="activeNote.objectivesDate">
								({{
									formatDate(activeNote.objectivesDate)
								}}) </span
							>:
						</strong>
						<ul class="ml-4 list-disc">
							<li v-for="o in activeNote.objectives" :key="o.id">
								<span class="font-semibold">{{
									o.goalLabel
								}}</span>
								<span v-if="o.details"> – {{ o.details }}</span>
							</li>
						</ul>
					</div>

					<p v-if="activeNote.otherTherapies">
						<strong>Other therapies:</strong>
						{{ activeNote.otherTherapies }}
					</p>
					<p v-if="activeNote.reinforcersUsed">
						<strong
							>Reinforcers used
							<span v-if="activeNote.reinforcersDate">
								({{
									formatDate(activeNote.reinforcersDate)
								}}) </span
							>:
						</strong>
						{{ activeNote.reinforcersUsed }}
					</p>
					<p v-if="activeNote.familyRecommendations">
						<strong
							>Recommendations
							<span v-if="activeNote.familyRecommendationsDate">
								({{
									formatDate(
										activeNote.familyRecommendationsDate
									)
								}}) </span
							>:
						</strong>
						{{ activeNote.familyRecommendations }}
					</p>
					<p v-if="activeNote.groupRecommendationParents">
						<strong>Group recommendation</strong>
						{{ activeNote.groupRecommendationParents }}
					</p>
					<p v-if="activeNote.goalsAchieved">
						<strong
							>Goals achieved
							<span v-if="activeNote.goalsAchievedDate">
								({{
									formatDate(activeNote.goalsAchievedDate)
								}}) </span
							>:
						</strong>
						{{ activeNote.goalsAchieved }}
					</p>
					<p v-if="activeNote.progressNotes">
						<strong
							>Progress notes
							<span v-if="activeNote.progressNotesDate">
								({{
									formatDate(activeNote.progressNotesDate)
								}}) </span
							>:
						</strong>
						{{ activeNote.progressNotes }}
					</p>
					<p v-if="activeNote.nextSessionObjectives">
						<strong
							>Next session objectives
							<span v-if="activeNote.nextSessionsObjectivesDate">
								({{
									formatDate(
										activeNote.nextSessionObjectivesDate
									)
								}}) </span
							>:
						</strong>
						{{ activeNote.nextSessionObjectives }}
					</p>
					<p v-if="activeNote.incidents">
						<strong
							>Incidents
							<span v-if="activeNote.incidentsDate">
								({{
									formatDate(activeNote.incidentsDate)
								}}) </span
							>:
						</strong>
						{{ activeNote.incidents }}
					</p>
					<p v-if="activeNote.generalObservations">
						<strong
							>General observations
							<span v-if="activeNote.generalObservationsDate">
								({{
									formatDate(
										activeNote.generalObservationsDate
									)
								}}) </span
							>:
						</strong>
						{{ activeNote.generalObservations }}
					</p>
				</div>

				<div class="mt-4 flex justify-end">
					<button
						type="button"
						class="bg-blay px-2 hover:cursor-pointer"
						@click="closeViewNoteModal"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, useCookie, useFetch, useRoute } from "#imports";
import { AccessPermission } from "~/types/permissions";
import { $fetch } from "ofetch";
import { therapyTypes } from "~/composables/therapy/therapyData";

import EditProfileModal from "~/components/EditProfileModal.vue";
import TherapistRecommendationsModal from "~/components/TherapistRecommendationsModal.vue";
import ProgressReportModal from "~/components/ProgressReportModal.vue";

interface EditProfileFormData {
	fName: string;
	mInit: string;
	lName: string;
	dob: string;
	gender: string;
	email: string;
	phone: string;
	whatsApp: string;
	contactPref: string;
	address: string;
	buildNum: string | number;
	city: string;
	postCode: string;
}

interface ProgressReportFormData {
	selectedTherapy: string;
	selectedObjectives: string[];
	objectiveDetails: Record<string, string>;
	customGoals: Array<{ id: number; label: string; details: string }>;
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

const access = useCookie("AccessPermission");

// Removed inline therapyTypes and objectivesByTherapy - now imported from composable

//Therapist Recommendations Modal
interface Recommendation {
	id: string;
	familyRecommendations: string;
	familyRecommendationsDate: string;
}
const showRecommendationsModal = ref(false);
const recommendations = ref<Recommendation[]>([]);

function openRecommendationsModal() {
	recommendations.value = therapyNotes.value
		.filter((note) => note.familyRecommendations)
		.sort(
			(a, b) =>
				new Date(b.familyRecommendationsDate).getTime() -
				new Date(a.familyRecommendationsDate).getTime()
		)
		.map((note) => ({
			id: note.id,
			familyRecommendations: note.familyRecommendations,
			familyRecommendationsDate: note.familyRecommendationsDate,
		}));

	showRecommendationsModal.value = true;
}

function viewRecommendation(note: Recommendation) {
	// Find the full note from therapyNotes
	const fullNote = therapyNotes.value.find((n) => n.id === note.id);
	if (fullNote) {
		openViewTherapyNote(fullNote);
	}
	showRecommendationsModal.value = false;
}

const route = useRoute();
const uId = route.params.id;

interface Profile {
	NonEmployee?: {
		dob?: string;
		Patient?: {
			Appointments?: Array<{ paid: boolean }>;
		};
	};
	[key: string]: unknown;
}

const profile = ref<Profile>({} as Profile);

async function getProfile() {
	const { data: test } = await useFetch("/api/profile/patient", {
		query: { id: uId },
	});
	profile.value = test.value;
}

getProfile();
loadTherapyNotes();

const paid = computed(() => {
	if (profile.value?.NonEmployee?.Patient?.Appointments) {
		let inFull = true;
		for (const session of profile.value.NonEmployee.Patient.Appointments) {
			if (!session.paid) {
				inFull = false;
			}
		}
		return inFull;
	}
	return false;
});

const age = computed(() => {
	const dobVal = profile.value?.NonEmployee?.dob;
	if (!dobVal) return "";

	const birth = new Date(dobVal);
	const today = new Date();

	let years = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();

	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		years--;
	}

	return years;
});

interface TherapyNote {
	id: number;
	createdAt: string;
	updatedAt?: string;
	therapyType: string;
	objectives?: Array<{
		id: number;
		goalLabel: string;
		details?: string;
	}>;
	objectivesDate?: string;
	otherTherapies?: string;
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
	nextSessionsObjectivesDate?: string;
	incidents?: string;
	incidentsDate?: string;
	generalObservations?: string;
	generalObservationsDate?: string;
	[key: string]: unknown;
}

const therapyNotes = ref<TherapyNote[]>([]);
const showViewNoteModal = ref(false);
const activeNote = ref<TherapyNote | null>(null);

const editingNoteId = ref<number | null>(null);

// Modal control flags.
const showEditModal = ref(false);
const showProgressReportModal = ref(false);

const editingNote = computed(() => {
	if (!editingNoteId.value) return null;
	return therapyNotes.value.find((n) => n.id === editingNoteId.value) || null;
});

// Methods to open/close modals.
function openEditModal() {
	showEditModal.value = true;
}

function addQuestion() {
	// Placeholder for add question functionality
	console.log("Add question clicked");
}

// Update the profile data from the edit form.
async function handleEditProfileSave(formData: EditProfileFormData) {
	const addressParts = formData.address.split(" ");
	const streetNum = addressParts[0] ? Number(addressParts[0]) : 0;
	const streetName = addressParts.slice(1).join(" ");

	await $fetch("/api/profile/patient", {
		method: "Put",
		body: {
			id: uId,
			fName: formData.fName,
			mInit: formData.mInit || "",
			lName: formData.lName,
			gender: formData.gender,
			dob: new Date(formData.dob).toISOString(),
			streetName: streetName,
			streetNum: streetNum,
			buildingNum: formData.buildNum,
			postcode: formData.postCode,
			identification: profile.value?.NonEmployee?.Patient?.identification,
			city: formData.city,
			contactPref: formData.contactPref,
			email: formData.email,
			phone: formData.phone,
			whatsapp: formData.whatsApp,
			isDiagnosed: profile.value?.NonEmployee?.Patient?.diagnosed,
		},
	});
	await getProfile();
	showEditModal.value = false;
}

async function handleProgressReportSave(formData: ProgressReportFormData) {
	const objectivesPayload: {
		goalKey?: string | null;
		goalLabel: string;
		details?: string | null;
	}[] = [];

	// Predefined objectives
	for (const key of formData.selectedObjectives) {
		objectivesPayload.push({
			goalKey: key,
			goalLabel: key,
			details: formData.objectiveDetails[key] || null,
		});
	}

	// Custom goals (only non-empty ones)
	for (const cg of formData.customGoals) {
		if (!cg.label && !cg.details) continue;
		objectivesPayload.push({
			goalKey: null,
			goalLabel: cg.label || "Other",
			details: cg.details || null,
		});
	}

	const payload = {
		patientId: uId,
		therapyType: formData.selectedTherapy,
		objectives: objectivesPayload,
		objectivesDate: dateStringWithCurrentTime(formData.objectivesDate),
		reinforcersUsed: formData.reinforcersUsed || null,
		reinforcersDate: dateStringWithCurrentTime(formData.reinforcersDate),
		familyRecommendations: formData.familyRecommendations || null,
		familyRecommendationsDate: dateStringWithCurrentTime(
			formData.familyRecommendationsDate
		),
		groupRecommendationParents: formData.groupRecommendationParents || null,
		goalsAchieved: formData.goalsAchieved || null,
		goalsAchievedDate: dateStringWithCurrentTime(
			formData.goalsAchievedDate
		),
		progressNotes: formData.progressNotes || null,
		progressNotesDate: dateStringWithCurrentTime(
			formData.progressNotesDate
		),
		nextSessionObjectives: formData.nextSessionObjectives || null,
		nextSessionObjectivesDate: dateStringWithCurrentTime(
			formData.nextSessionObjectivesDate
		),
		incidents: formData.incidents || null,
		incidentsDate: dateStringWithCurrentTime(formData.incidentsDate),
		generalObservations: formData.generalObservations || null,
		generalObservationsDate: dateStringWithCurrentTime(
			formData.generalObservationsDate
		),
	};

	const noteId = editingNoteId.value;
	const url = noteId
		? `/api/session/therapyNotes/${noteId}`
		: "/api/session/therapyNotes";

	const method = noteId ? "PUT" : "POST";

	try {
		await $fetch(url, {
			method,
			body: payload,
		});

		await loadTherapyNotes();
		showProgressReportModal.value = false;
		editingNoteId.value = null;
	} catch (err: unknown) {
		console.error("Error saving therapy note:", err);
		const error = err as { data?: { error?: string }; message?: string };
		const fromApi = error?.data?.error;
		const msg = fromApi || error?.message || "Unknown error";
		alert("Could not save therapy note: " + msg);
	}
}

function dateStringWithCurrentTime(
	dateStr: string | null | undefined
): string | null {
	if (!dateStr) return null;

	// dateStr is "YYYY-MM-DD"
	const parts = dateStr.split("-").map(Number);
	if (parts.length !== 3) return null;

	const [year, month, day] = parts;
	if (!year || !month || !day) return null;

	const now = new Date();

	// Same day as selected date, time = current time
	const combined = new Date(
		year,
		month - 1,
		day,
		now.getHours(),
		now.getMinutes(),
		now.getSeconds(),
		now.getMilliseconds()
	);

	return combined.toISOString();
}

async function loadTherapyNotes() {
	const res = await $fetch("/api/session/therapyNotes", {
		method: "GET",
		params: { patientId: uId },
	});
	const data = (res as { data?: TherapyNote[] }).data;
	therapyNotes.value = data || [];
}

function formatDate(value?: string | Date | null) {
	if (!value) return "No date";
	const d = new Date(value);
	if (isNaN(d.getTime())) return "No date";

	return d.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

function openNewTherapyNote() {
	editingNoteId.value = null;
	showProgressReportModal.value = true;
}

function openEditTherapyNote(note: { id: number }) {
	editingNoteId.value = note.id;
	showProgressReportModal.value = true;
}

function openViewTherapyNote(note: { id: number }) {
	activeNote.value = note;
	showViewNoteModal.value = true;
}

function closeViewNoteModal() {
	showViewNoteModal.value = false;
	activeNote.value = null;
}
</script>
