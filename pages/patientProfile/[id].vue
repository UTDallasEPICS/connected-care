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
				Therapy Notes
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

		<!-- ================= MODAL: Write Therapy Notes (for Therapist) ================= -->
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
				<h2 class="mb-4 text-xl font-bold">Therapy Note</h2>
				<form @submit.prevent="submitProgressReport">
					<!-- Therapy + Objectives worked on (drill down) -->
					<div class="mb-4 grid gap-4 md:grid-cols-2">
						<!-- Therapy -->
						<div>
							<label class="mb-1 block font-medium">
								Therapy (drill down)
								<span class="text-red-500">*</span>
							</label>
							<select
								class="input w-full"
								v-model="selectedTherapy"
								required
								@change="
									selectedObjectives = [];
									objectiveDetails = {};
								"
							>
								<option value="" disabled>
									Select a therapy
								</option>
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
									selectedTherapy
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
										class="mt-3 mb-1 border-b border-gray-300 text-xs font-bold text-blue-700 uppercase"
									>
										{{ item.header }}
									</div>

									<!-- SUB-SECTION LABEL -->
									<div
										v-else-if="item.subheader"
										class="mt-2 mb-1 text-sm font-semibold text-gray-700"
									>
										{{ item.subheader }}
									</div>

									<!-- ACTUAL CHECKBOX OBJECTIVE -->
									<div
										v-else
										class="ml-4 flex items-center gap-2"
									>
										<input
											type="checkbox"
											class="h-4 w-4"
											:id="`obj-${item}`"
											:value="item"
											v-model="selectedObjectives"
										/>
										<label
											:for="`obj-${item}`"
											class="text-sm"
										>
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
						<div v-if="selectedObjectives.length" class="space-y-3">
							<div
								v-for="objectiveKey in selectedObjectives"
								:key="objectiveKey"
								class="space-y-1 rounded border p-2"
							>
								<div class="text-sm font-semibold">
									{{ objectiveKey }}
								</div>
								<textarea
									class="input w-full"
									rows="2"
									v-model="objectiveDetails[objectiveKey]"
									:placeholder="`Details for: ${objectiveKey}`"
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
								type="date"
								class="input w-full md:w-1/3"
								v-model="objectivesDate"
							/>
						</div>
					</div>

					<!-- Other / custom goals -->
					<div class="mb-4">
						<div class="mb-2 flex items-center justify-between">
							<label class="block font-medium">
								Other goal(s)
							</label>
							<button
								type="button"
								class="text-sm underline hover:cursor-pointer"
								@click="addCustomGoal"
							>
								+ Add other goal
							</button>
						</div>

						<div v-if="customGoals.length" class="space-y-3">
							<div
								v-for="cg in customGoals"
								:key="cg.id"
								class="space-y-2 rounded border p-2"
							>
								<div class="flex items-center gap-2">
									<input
										type="text"
										class="input w-full"
										v-model="cg.label"
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
									class="input w-full"
									rows="2"
									v-model="cg.details"
									placeholder="Details for this other goal"
								></textarea>
							</div>
						</div>
						<p v-else class="text-sm text-gray-500">
							Click “Add other goal” to define custom goals for
							this therapy.
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
								class="input w-full"
								rows="2"
								v-model="reinforcersUsed"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="reinforcersDate"
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
								class="input w-full"
								rows="3"
								v-model="familyRecommendations"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="familyRecommendationsDate"
							/>
						</div>
					</div>

					<!-- Group recommendation for parents (Independent Living, etc.) -->
					<div
						class="mb-4"
						v-if="selectedTherapy === 'INDEPENDENT_LIVING'"
					>
						<label class="mb-1 block font-medium">
							Group recommendation for parents
						</label>
						<textarea
							class="input w-full"
							rows="3"
							v-model="groupRecommendationParents"
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
							</label>
							<textarea
								class="input w-full"
								rows="3"
								v-model="goalsAchieved"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="goalsAchievedDate"
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
							</label>
							<textarea
								class="input w-full"
								rows="4"
								v-model="progressNotes"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="progressNotesDate"
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
							</label>
							<textarea
								class="input w-full"
								rows="3"
								v-model="nextSessionObjectives"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="nextSessionObjectivesDate"
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
								class="input w-full"
								rows="3"
								v-model="incidents"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="incidentsDate"
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
								class="input w-full"
								rows="3"
								v-model="generalObservations"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-medium"> Date </label>
							<input
								type="date"
								class="input w-full"
								v-model="generalObservationsDate"
							/>
						</div>
					</div>

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
import { $fetch } from "ofetch";

const contactType = ["EMAIL", "PHONE", "WHATS_APP"];

const gender = ["MALE", "FEMALE", "OTHER"];

const access = useCookie("AccessPermission");

// Therapy types (keys) -> labels for dropdown
const therapyTypes: Record<string, string> = {
	LEARNING_THERAPY: "Learning Therapy",
	BEHAVIORAL_EARLY: "Behavioral Therapy & Early Intervention Therapy",
	SPEECH_THERAPY: "Speech Therapy",
	SOCIAL_SKILLS: "Social Skills Therapy",
	OCCUPATIONAL_THERAPY: "Occupational Therapy",
	INDEPENDENT_LIVING: "Independent Living Skills Training Program",
};

// Objectives by therapy
const objectivesByTherapy: Record<string, string[]> = {
	LEARNING_THERAPY: [
		{ header: "From ABBLS" },
		{ subheader: "Basic Student Skills" },
		"A. Cooperation and Reinforcer Effectiveness",
		"B. Visual Performance",
		"C. Receptive Language",
		"D. Motor Imitation",
		"E. Vocal Imitation",
		"F. Requests",
		"G. Labeling",
		"H. Intraverbals",
		"I. Spontaneous Vocalizations",
		"J. Syntax and Grammar",
		"K. Recess and Free Time",
		"L. Social Interaction",
		"M. Group Instruction",
		"N. Following Classroom Routines",
		"P. Generalized Responses",

		{ subheader: "Academic Skills" },
		"Q. Reading Skills",
		"R. Math Skills",
		"S. Writing Skills",
		"T. Spelling Skills",

		{ subheader: "Executive Functions" },
		"1. Working memory",
		"2. Processing speed",
		"3. Inhibitory control",
		"4. Cognitive flexibility",
		"5. Planning",

		{ subheader: "Cognitive Skills" },
		"1. Comprehension",
		"2. Reasoning",
		"3. Attention",
		"4. Problem-solving",

		{ header: "Other Areas" },
		{ subheader: "Executive Functions" },
		"1. Working memory",
		"2. Processing speed",
		"3. Inhibitory control",
		"4. Cognitive flexibility",
		"5. Planning",
		{ subheader: "Cognitive Skills" },
		"1. Comprehension",
		"2. Reasoning",
		"3. Attention",
		"4. Problem-solving",
		{ subheader: "Others" },
		"Other(Specify)",
	],
	BEHAVIORAL_EARLY: [
		{ subheader: "Basic Student Skills" },
		"A. Cooperation and Reinforcer Effectiveness",
		"B. Visual Performance",
		"C. Receptive Language",
		"D. Motor Imitation",
		"E. Vocal Imitation",
		"F. Requests",
		"G. Labeling",
		"H. Intraverbals",
		"I. Spontaneous Vocalizations",
		"J. Syntax and Grammar",
		"K. Recess and Free Time",
		"L. Social Interaction",
		"M. Group Instruction",
		"N. Following Classroom Routines",
		"P. Generalized Responses",
		{ subheader: "Academic Skills" },
		"Q. Reading Skills",
		"R. Math Skills",
		"S. Writing Skills",
		"T. Spelling Skills",
		{ subheader: "Self-help Skills" },
		"U. Dressing Skills",
		"V. Eating Skills",
		"W. Personal Maintenance",
		"X. Personal Hygiene and Toilet Training",
		{ subheader: "Motor Skills" },
		"Y. Gross Motor Skills",
		"Z. Fine Motor Skills",
	],
	SPEECH_THERAPY: [
		"C. Receptive Language",
		"E. Vocal Imitation",
		"F. Requests",
		"G. Labeling",
		"H. Intraverbals",
		"I. Spontaneous Vocalizations",
		"J. Syntax and Grammar",
		"L. Social Interaction",
	],
	SOCIAL_SKILLS: [
		{ subheader: "Program Modules:" },
		"1. Development of Social Autonomy",
		"2. Understanding Bullying",
		"3. Identifying Healthy Relationships",
		"4. Setting Personal Boundaries",
	],
	OCCUPATIONAL_THERAPY: [
		{ header: "Occupational Therapy Objectives" },

		{ subheader: "1. Sensory Integration" },
		"Regulation of sensory responses (hyper- or hypo-reactivity)",
		"Improving sensory modulation for functional participation",

		{ subheader: "2. Gross and Fine Motor Skills" },
		"Motor coordination (balance, strength, motor planning)",
		"Manual precision and skills for play, writing, and daily activities",

		{ subheader: "3. Self-regulation Skills" },
		"Emotional management and adaptive behavior",
		"Coping strategies for frustration and changes",

		{ subheader: "4. Daily Living Skills (DLS)" },
		"Eating, dressing, hygiene, toileting",
		"Promoting independence in daily routines",

		{ subheader: "5. Functional Communication and Social Skills" },
		"Supporting interaction with others (children, adults)",
		"Taking turns, eye contact, body language for communication",

		{ subheader: "6. Play and Leisure" },
		"Participation in age-appropriate games",
		"Development of symbolic, functional, and shared play",

		{ subheader: "7. Cognitive and Attention Skills" },
		"Sustained attention, memory, problem-solving",
		"Transitioning between activities and following instructions",

		{ subheader: "8. Environmental Adaptation and Visual Supports" },
		"Using environmental adaptations and visual supports to enhance participation",
	],
	INDEPENDENT_LIVING: [
		{ header: "Independent Living Skills Training Program" },
		{ subheader: "Autonomy Modules" },

		// required custom textarea already exists (group recommendation for parents)

		{ subheader: "Introduction to the Autonomy Workshop" },
		"1. Meeting peers and creating rules for coexistence",
		"2. Expressing personal information and workshop activities",
		"3. Understanding how and why to make choices (knowing one’s rights)",

		{ subheader: "Personal Hygiene Autonomy" },
		"1. Following a bathing routine (body hygiene)",
		"2. Brushing teeth (oral care)",
		"3. Combing hair (hair care)",
		"4. Cleaning and trimming nails (nail care)",
		"5. Washing hands",
		"6. Choosing and wearing clothes",
		"7. Using cutlery and tableware (meal autonomy and table manners)",

		{ subheader: "Home Tasks and Appliance Use Autonomy" },
		"1. Tidying up bedroom",
		"2. Dusting areas and objects",
		"3. Sweeping and mopping floors",
		"4. Cleaning the bathroom",
		"5. Safely using appliances",
		"6. Setting and clearing the table",
		"7. Dishwashing",
		"8. Using and cleaning the kitchen",
		"9. Using and cleaning laundry appliances",

		{ subheader: "Money Use Autonomy" },
		"1. Learning about money: production and distribution",
		"2. Understanding the use of money",
		"3. Identifying and calculating bills and coins",
		"4. Using credit and debit cards",
		"5. Recognizing ATMs and simulating their use",
		"6. Making a simple purchase",

		{ subheader: "Travel and Mobility Autonomy" },
		"1. Identifying common places",
		"2. Recognizing traffic signs",
		"3. Recognizing public and private transportation",
		"4. Learning about street safety",

		{ subheader: "Technology Use Autonomy" },
		"1. Using the computer with assistance",
		"2. Using the tablet with assistance",
		"3. Using the cellphone with assistance",
		"4. Using the ATM with assistance",

		// ---------------------------------------------------------------------
		// EXTRA MODULES (Camping, Gardening, Crafts, Cooking)
		// ---------------------------------------------------------------------

		{ header: "Additional Modules" },

		{ subheader: "Camping" },
		"1. Encourage coexistence and teamwork",
		"2. Develop basic survival skills",
		"3. Connect with nature and the environment",
		"4. Improve self-esteem and autonomy",
		"5. Promote fun and rest",

		{ subheader: "Gardening" },
		"1. Promote sustainability and recycling",
		"2. Create a green and relaxing space",
		"3. Develop responsibility and care habits",

		{ subheader: "Crafts" },
		"1. Develop manual skills and stimulate creativity",
		"2. Foster patience and perseverance",
		"3. Encourage step-by-step project work",
		"4. Build problem-solving capacity",
		"5. Promote teamwork skills",

		{ subheader: "Cooking" },
		"1. Prepare daily meals",

		// ---------------------------------------------------------------------
		// Occupational Therapy Skills Module (Inside Independent Living)
		// ---------------------------------------------------------------------
		{ header: "Occupational Therapy Skills Module" },

		"1. Strengthen gross motor coordination",
		"2. Promote fine motor skills",
		"3. Encourage decision-making",
		"4. Stimulate problem-solving",
		"5. Manage frustration and build resilience",
		"6. Improve social interactions",

		// ---------------------------------------------------------------------
		// Arts, Movement, Communication Module
		// ---------------------------------------------------------------------
		{ header: "Arts, Movement & Communication Module" },
		// group recommendation for parents already handled

		{ subheader: "Arts" },
		"1. Stimulate lateral thinking and creativity",
		"2. Support self-regulation",
		"3. Express emotions and interests",
		"4. Develop visuomotor coordination",
		"5. Practice waiting",
		"6. Interpret reality",
		"7. Encourage attentive observation",
		"8. Improve attention to detail",
		"9. Develop fine motor skills",
		"10. Stimulate problem-solving",

		{ subheader: "Communication" },
		"1. Encourage oral expression",
		"2. Show feelings and express emotions appropriately",
		"3. Express interests",
		"4. Stimulate social interactions",
		"5. Vocalization, projection, rhythm, imitation",
		"6. Encourage reading",
		"7. Practice diction",
		"8. Promote teamwork",
		"9. Stimulate imitation",

		{ subheader: "Movement" },
		"1. Increase body awareness and flexibility",
		"2. Coordinate with others in group activities",
		"3. Stimulate imitation",
		"4. Move with awareness",
		"5. Foster attention",
		"6. Develop gross motor skills",
	],
};

// Computed list for selected therapy
const objectivesForSelectedTherapy = computed(() => {
	if (!selectedTherapy.value) return [];
	return objectivesByTherapy[selectedTherapy.value] || [];
});

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
// Therapy notes state
// Selected therapy type
const selectedTherapy = ref("");

// List of selected predefined objective keys
const selectedObjectives = ref<string[]>([]);

// Map from objective key to details text
const objectiveDetails = ref<Record<string, string>>({});

const groupRecommendationParents = ref("");

// Custom (other) goals for this note
const customGoals = ref<{ id: number; label: string; details: string }[]>([]);

let nextCustomGoalId = 1;

// Helper: add an empty custom goal row
function addCustomGoal() {
	customGoals.value.push({
		id: nextCustomGoalId++,
		label: "",
		details: "",
	});
}

// Helper: remove one custom goal row
function removeCustomGoal(id: number) {
	customGoals.value = customGoals.value.filter((cg) => cg.id !== id);
}

// Text + date fields
const otherTherapies = ref("");

const objectivesDate = ref("");

const reinforcersUsed = ref("");
const reinforcersDate = ref("");

const familyRecommendations = ref("");
const familyRecommendationsDate = ref("");

const goalsAchieved = ref("");
const goalsAchievedDate = ref("");

const progressNotes = ref("");
const progressNotesDate = ref("");

const nextSessionObjectives = ref("");
const nextSessionObjectivesDate = ref("");

const incidents = ref("");
const incidentsDate = ref("");

const generalObservations = ref("");
const generalObservationsDate = ref("");

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

async function submitProgressReport() {
	if (!selectedTherapy.value) {
		alert("Please select a therapy.");
		return;
	}

	// Only count objectives that actually have content
	const hasPredefinedObjectives = selectedObjectives.value.length > 0;

	const hasNonEmptyCustomGoals = customGoals.value.some(
		(g) =>
			(g.label && g.label.trim() !== "") ||
			(g.details && g.details.trim() !== "")
	);

	if (!hasPredefinedObjectives && !hasNonEmptyCustomGoals) {
		alert("Please select at least one objective or add another goal.");
		return; // do not call the API
	}

	const objectivesPayload: {
		goalKey?: string | null;
		goalLabel: string;
		details?: string | null;
	}[] = [];

	// Predefined objectives
	for (const key of selectedObjectives.value) {
		objectivesPayload.push({
			goalKey: key,
			goalLabel: key,
			details: objectiveDetails.value[key] || null,
		});
	}

	// Custom goals (only non-empty ones)
	for (const cg of customGoals.value) {
		if (!cg.label && !cg.details) continue;
		objectivesPayload.push({
			goalKey: null,
			goalLabel: cg.label || "Other",
			details: cg.details || null,
		});
	}

	const payload = {
		patientId: uId,
		therapyType: selectedTherapy.value,
		objectives: objectivesPayload,
		objectivesDate: dateStringWithCurrentTime(objectivesDate.value),
		reinforcersUsed: reinforcersUsed.value || null,
		reinforcersDate: dateStringWithCurrentTime(reinforcersDate.value),
		familyRecommendations: familyRecommendations.value || null,
		familyRecommendationsDate: dateStringWithCurrentTime(
			familyRecommendationsDate.value
		),
		groupRecommendationParents: groupRecommendationParents.value || null,
		goalsAchieved: goalsAchieved.value || null,
		goalsAchievedDate: dateStringWithCurrentTime(goalsAchievedDate.value),
		progressNotes: progressNotes.value || null,
		progressNotesDate: dateStringWithCurrentTime(progressNotesDate.value),
		nextSessionObjectives: nextSessionObjectives.value || null,
		nextSessionObjectivesDate: dateStringWithCurrentTime(
			nextSessionObjectivesDate.value
		),
		incidents: incidents.value || null,
		incidentsDate: dateStringWithCurrentTime(incidentsDate.value),
		generalObservations: generalObservations.value || null,
		generalObservationsDate: dateStringWithCurrentTime(
			generalObservationsDate.value
		),
	};

	const url = editingNoteId.value
		? `/api/session/therapyNotes/${editingNoteId.value}`
		: "/api/session/therapyNotes";

	const method = editingNoteId.value ? "PUT" : "POST";

	try {
		await $fetch(url, {
			method,
			body: payload,
		});

		await loadTherapyNotes();
		closeProgressReportModal();
	} catch (err) {
		console.error("Error saving therapy note:", err);
		const fromApi = err?.data?.error;
		const msg = fromApi || err?.message || "Unknown error";
		alert("Could not save therapy note: " + msg);
	}
}

function dateStringWithCurrentTime(
	dateStr: string | null | undefined
): string | null {
	if (!dateStr) return null;

	// dateStr is "YYYY-MM-DD"
	const [year, month, day] = dateStr.split("-").map(Number);
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
	const data = (res as { data?: unknown[] }).data;
	therapyNotes.value = (data as unknown[]) || [];
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

function resetTherapyNoteForm() {
	selectedTherapy.value = "";
	selectedObjectives.value = [];
	objectiveDetails.value = {};
	customGoals.value = [];
	otherTherapies.value = "";

	objectivesDate.value = "";

	reinforcersUsed.value = "";
	reinforcersDate.value = "";

	familyRecommendations.value = "";
	familyRecommendationsDate.value = "";

	goalsAchieved.value = "";
	goalsAchievedDate.value = "";

	progressNotes.value = "";
	progressNotesDate.value = "";

	nextSessionObjectives.value = "";
	nextSessionObjectivesDate.value = "";

	incidents.value = "";
	incidentsDate.value = "";

	generalObservations.value = "";
	generalObservationsDate.value = "";

	groupRecommendationParents.value = "";
}

function openNewTherapyNote() {
	editingNoteId.value = null;
	resetTherapyNoteForm();
	showProgressReportModal.value = true;
}

function openEditTherapyNote(note) {
	editingNoteId.value = note.id;
	resetTherapyNoteForm();

	selectedTherapy.value = note.therapyType;

	// Date fields
	objectivesDate.value = note.objectivesDate
		? note.objectivesDate.slice(0, 10)
		: "";

	reinforcersUsed.value = note.reinforcersUsed || "";
	reinforcersDate.value = note.reinforcersDate
		? note.reinforcersDate.slice(0, 10)
		: "";

	familyRecommendations.value = note.familyRecommendations || "";
	familyRecommendationsDate.value = note.familyRecommendationsDate
		? note.familyRecommendationsDate.slice(0, 10)
		: "";

	goalsAchieved.value = note.goalsAchieved || "";
	goalsAchievedDate.value = note.goalsAchievedDate
		? note.goalsAchievedDate.slice(0, 10)
		: "";

	progressNotes.value = note.progressNotes || "";
	progressNotesDate.value = note.progressNotesDate
		? note.progressNotesDate.slice(0, 10)
		: "";

	nextSessionObjectives.value = note.nextSessionObjectives || "";
	nextSessionObjectivesDate.value = note.nextSessionObjectivesDate
		? note.nextSessionObjectivesDate.slice(0, 10)
		: "";

	incidents.value = note.incidents || "";
	incidentsDate.value = note.incidentsDate
		? note.incidentsDate.slice(0, 10)
		: "";

	generalObservations.value = note.generalObservations || "";
	generalObservationsDate.value = note.generalObservationsDate
		? note.generalObservationsDate.slice(0, 10)
		: "";

	// Objectives: split into predefined vs custom
	selectedObjectives.value = [];
	objectiveDetails.value = {};
	customGoals.value = [];

	if (note.objectives && Array.isArray(note.objectives)) {
		for (const obj of note.objectives) {
			if (obj.goalKey) {
				if (!selectedObjectives.value.includes(obj.goalKey)) {
					selectedObjectives.value.push(obj.goalKey);
				}
				objectiveDetails.value[obj.goalKey] = obj.details || "";
			} else {
				customGoals.value.push({
					id: nextCustomGoalId++,
					label: obj.goalLabel || "Other",
					details: obj.details || "",
				});
			}
		}
	}

	showProgressReportModal.value = true;
}

function openViewTherapyNote(note) {
	activeNote.value = note;
	showViewNoteModal.value = true;
}

function closeViewNoteModal() {
	showViewNoteModal.value = false;
	activeNote.value = null;
}
</script>
