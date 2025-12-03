<template>
	<div class="font-sc-encode p-4">
		<!-- Dashboard Header -->
		<div class="mb-4 flex flex-row items-center">
			<h1 class="font-cormorant-garamond text-3xl font-bold text-nowrap">
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
			<button
				v-if="access[AccessPermission.THERAPIST]"
				class="btn text-nowrap hover:cursor-pointer"
				@click="openNewTherapyNote"
			>
				Write Progress Report
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
				<div class="mt-8 mb-2">
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

			<p class="mt-8 mb-2">
				<strong>Diagnosed?</strong>
				{{ profile?.NonEmployee?.Patient?.diagnosed }}
			</p>
			<p v-if="!access[AccessPermission.THERAPIST]" class="mb-2">
				<strong>All Sessions Paid?</strong>
				{{ paid }}
			</p>

			<!-- Progress Reports (View Only) -->
			<div class="mt-8">
				<h2 class="mb-2 text-xl font-semibold">Progress Reports</h2>
				<ul class="list-disc pl-6">
					<li
						v-for="(report, index) in profile?.NonEmployee?.Patient
							?.ProgressReports"
						:key="index"
					>
						<strong
							>{{ new Date(report.date).toDateString() }}:</strong
						>
						<ul class="pl-6">
							<li
								v-for="(question, index) in report?.Questions"
								:key="index"
							>
								{{ index + 1 }}.
								<strong>{{ question.question }}:</strong>
								{{ question.answer }}
							</li>
						</ul>
					</li>
				</ul>
				<p
					v-if="
						!profile?.NonEmployee?.Patient?.ProgressReports.length
					"
				>
					No progress reports available.
				</p>
			</div>
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

		<!-- ================= MODAL: Edit Profile (for Patient/Parent) ================= -->
		<div
			v-if="showEditModal"
			class="fixed inset-0 z-50 flex items-center justify-center"
			aria-modal="true"
			role="dialog"
		>
			<!-- Dimmed Background -->
			<div
				class="absolute inset-0 bg-black/70"
				@click.self="closeEditModal"
			></div>

			<!-- Modal Content -->
			<div
				class="relative z-10 w-full max-w-7/12 overflow-y-auto bg-white p-6 shadow-md"
				@click.stop
			>
				<h2 class="mb-4 text-xl font-bold">Edit Profile</h2>
				<form @submit.prevent="updateProfile">
					<!-- Name -->
					<div
						class="mb-4 flex w-full flex-col justify-between gap-4 lg:flex-row 2xl:gap-8"
					>
						<div class="w-full">
							<label class="mb-1 block font-medium" for="fname">
								First Name <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="fname"
								v-model="profileEdits.fName"
								required
								class="input w-full"
								placeholder="Enter your first name"
							/>
						</div>
						<div class="w-full lg:w-lg 2xl:w-xl">
							<label class="mb-1 block font-medium" for="minit">
								Middle Initial
							</label>
							<input
								type="text"
								id="minit"
								v-model="profileEdits.mInit"
								class="input w-full"
								placeholder="Enter your initial"
							/>
						</div>
						<div class="w-full">
							<label class="mb-1 block font-medium" for="lname">
								Last Name <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="lname"
								v-model="profileEdits.lName"
								required
								class="input w-full"
								placeholder="Enter your last name"
							/>
						</div>
					</div>

					<!-- DOB -->
					<div class="mb-4">
						<label class="mb-1 block font-medium" for="dob">
							DOB <span class="text-red-500">*</span>
						</label>
						<input
							type="date"
							id="dob"
							v-model="dob"
							required
							class="input w-full"
							placeholder="Enter your email"
						/>
					</div>

					<!-- Gender -->
					<div class="mb-4">
						<label class="mb-1 block font-medium">
							Gender <span class="text-red-500">*</span>
						</label>
						<select class="input w-full" v-model="genderEdit">
							<option
								v-for="(type, index) in gender"
								:key="index"
							>
								{{ type }}
							</option>
						</select>
					</div>

					<!-- Email -->
					<div class="mb-4">
						<label class="mb-1 block font-medium" for="email">
							Email <span class="text-red-500">*</span>
						</label>
						<input
							type="email"
							id="email"
							v-model="profileEdits.email"
							required
							class="input w-full"
							placeholder="Enter your email"
						/>
					</div>

					<!-- Phone -->
					<div class="mb-4">
						<label class="mb-1 block font-medium" for="phone">
							Phone <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="phone"
							v-model="profileEdits.phone"
							required
							class="input w-full"
							placeholder="Enter your phone number"
						/>
					</div>

					<!-- What's App -->
					<div class="mb-4">
						<label class="mb-1 block font-medium" for="whatsapp">
							What's App <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="whatsapp"
							v-model="profileEdits.whatsApp"
							required
							class="input w-full"
							placeholder="Enter your what's app number"
						/>
					</div>

					<!-- Contact Preference -->
					<div class="mb-4">
						<label class="mb-1 block font-medium">
							Contact Preference
							<span class="text-red-500">*</span>
						</label>
						<select
							class="input w-full"
							v-model="profileEdits.contactPref"
						>
							<option
								v-for="(type, index) in contactType"
								:key="index"
							>
								{{ type }}
							</option>
						</select>
					</div>

					<!-- Address -->
					<div
						class="mb-4 flex w-full flex-col justify-between gap-4 lg:flex-row 2xl:gap-8"
					>
						<div class="w-full">
							<label class="mb-1 block font-medium" for="address">
								Address
							</label>
							<input
								type="text"
								id="address"
								v-model="addressEdit"
								class="input w-full"
								placeholder="Enter your address"
							/>
						</div>
						<div class="w-md">
							<label class="mb-1 block font-medium" for="address">
								Building Number
							</label>
							<input
								type="number"
								id="address"
								v-model="buildNumEdit"
								class="input w-full"
								placeholder="Enter your address"
							/>
						</div>
					</div>

					<!-- City & Postcode -->
					<div
						class="mb-4 flex w-full flex-col justify-between gap-4 lg:flex-row 2xl:gap-8"
					>
						<div class="w-full">
							<label class="mb-1 block font-medium" for="city">
								City <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="city"
								v-model="cityEdit"
								required
								class="input w-full"
								placeholder="Enter your city"
							/>
						</div>
						<div class="w-full">
							<label
								class="mb-1 block font-medium"
								for="postcode"
							>
								Post Code <span class="text-red-500">*</span>
							</label>
							<input
								type="number"
								id="postcode"
								v-model="postCodeEdit"
								required
								class="input w-full"
								placeholder="Enter your post code"
							/>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex justify-end space-x-2">
						<button
							type="button"
							class="bg-blay px-2 hover:cursor-pointer"
							@click="closeEditModal"
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

		<!-- ================= MODAL: Write Progress Report (for Therapist) ================= -->
		<div
			v-if="showProgressReportModal"
			class="fixed inset-0 z-50 flex items-center justify-center"
			aria-modal="true"
			role="dialog"
		>
			<!-- Dimmed Background -->
			<div
				class="absolute inset-0 bg-black/70"
				@click.self="closeProgressReportModal"
			></div>

			<!-- Modal Content -->
			<div
				class="relative z-10 max-h-9/12 w-full max-w-9/12 overflow-auto rounded bg-white p-6 shadow-md"
				@click.stop
			>
				<h2 class="mb-4 text-xl font-bold">Write Progress Report</h2>
				<form @submit.prevent="submitProgressReport">
					<div
						v-for="(question, index) in progressReportQuestions"
						:key="index"
					>
						<div
							class="mb-4 flex w-full flex-col justify-between gap-4"
						>
							<div class="flex w-full flex-row">
								<label class="text-nowrap">
									Question {{ index + 1 }}
								</label>
								<div class="w-full"></div>
								<button
									class="cursor-pointer"
									type="button"
									@click="removeQuestion(index)"
								>
									<X />
								</button>
							</div>
							<input
								v-model="question.question"
								placeholder="Question"
								class="input w-full"
								required
							/>
							<textarea
								v-model="question.answer"
								placeholder="Answer"
								class="input w-full"
								required
							/>
						</div>
					</div>
					<button
						class="bg-smoky mb-4 flex w-full cursor-pointer justify-center"
						type="button"
						@click="addQuestion"
					>
						<Plus />
					</button>
					<!-- Action Buttons -->
					<div class="flex justify-end space-x-2">
						<button
							type="button"
							class="bg-blay px-2 hover:cursor-pointer"
							@click="closeProgressReportModal"
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
				class="relative z-10 max-h-9/12 w-full max-w-3/12 overflow-auto rounded bg-white p-6 shadow-md"
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
import { AccessPermission } from "~/permissions";
import { Plus, X } from "lucide-vue-next";
import { $fetch } from "ofetch";

const contactType = ["EMAIL", "PHONE", "WHATS_APP"];

const gender = ["MALE", "FEMALE", "OTHER"];

const access = useCookie("AccessPermission");

const route = useRoute();
const uId = route.params.id;

const profile = ref({});
const profileEdits = ref({});
const dob = ref();
const genderEdit = ref();
const addressEdit = ref();
const buildNumEdit = ref();
const cityEdit = ref();
const postCodeEdit = ref();

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

const therapyNotes = ref([]);
const showViewNoteModal = ref(false);
const activeNote = ref(null);

const editingNoteId = ref<number | null>(null);

// Modal control flags.
const showEditModal = ref(false);
const showProgressReportModal = ref(false);

// Form object for a new progress report (for therapists).
const progressReportQuestions = ref([{ question: "", answer: "" }]);

function addQuestion() {
	progressReportQuestions.value.push({ question: "", answer: "" });
}

function removeQuestion(i) {
	progressReportQuestions.value.splice(i, 1);
	if (progressReportQuestions.value.length < 1) {
		progressReportQuestions.value.push({ question: "", answer: "" });
	}
}

// Methods to open/close modals.
function openEditModal() {
	// Pre-populate the edit form with current profile data.
	Object.assign(profileEdits.value, profile.value);
	if (profileEdits.value?.NonEmployee?.dob) {
		dob.value = profileEdits.value.NonEmployee.dob.split("T")[0];
	}
	if (profileEdits.value?.NonEmployee?.gender) {
		genderEdit.value = profileEdits.value.NonEmployee.gender;
	}
	if (profileEdits.value?.NonEmployee) {
		addressEdit.value = "".concat(
			profileEdits.value.NonEmployee.streetNum,
			" ",
			profileEdits.value.NonEmployee.streetName
		);
	}
	if (profileEdits.value.NonEmployee.PostCodeCity.city) {
		cityEdit.value = profileEdits.value.NonEmployee.PostCodeCity.city;
	}
	if (profileEdits.value.NonEmployee.postCode) {
		postCodeEdit.value = profileEdits.value.NonEmployee.postCode;
	}
	showEditModal.value = true;
}

function closeEditModal() {
	showEditModal.value = false;
}

function closeProgressReportModal() {
	showProgressReportModal.value = false;
	// Reset progress report form.
	progressReportQuestions.value = [{ question: "", answer: "" }];
}

// Update the profile data from the edit form.
async function updateProfile() {
	await $fetch("/api/profile/patient", {
		method: "Put",
		body: {
			id: uId,
			fName: profileEdits.value.fName,
			mInit: profileEdits.value.mInit || "",
			lName: profileEdits.value.lName,
			gender: profileEdits.value.NonEmployee.gender,
			dob: new Date(dob.value).toISOString(),
			streetName: addressEdit.value.substring(
				addressEdit.value.indexOf(" ") + 1
			),
			streetNum: Number(
				addressEdit.value.substring(0, addressEdit.value.indexOf(" "))
			),
			buildingNum: buildNumEdit.value,
			postcode: postCodeEdit.value,
			identification:
				profileEdits.value.NonEmployee.Patient.identification,
			city: cityEdit.value,
			contactPref: profileEdits.value.contactPref,
			email: profileEdits.value.email,
			phone: profileEdits.value.phone,
			whatsapp: profileEdits.value.whatsApp,
			isDiagnosed: profileEdits.value.NonEmployee.Patient.diagnosed,
		},
	});
	getProfile();
	closeEditModal();
}

// Submit a new progress report (for therapists).
async function submitProgressReport() {
	const date = new Date().toISOString();
	await $fetch("/api/profile/report", {
		method: "Post",
		body: {
			date: date,
			pId: uId,
			questions: progressReportQuestions.value,
		},
	});

	getProfile();
	closeProgressReportModal();
}
</script>
