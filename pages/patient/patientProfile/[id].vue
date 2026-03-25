<template>
	<div class="font-sc-encode p-4">
		<!-- Dashboard Header -->
		<div class="mb-4 flex flex-row items-center">
			<h1 class="font-cormorant-garamond text-nowrap text-3xl font-bold">
				User Profile
			</h1>
			<div class="w-full"></div>

			<!-- Patient-only buttons -->
			<template v-if="can('PATIENT')">
				<button
					class="btn text-nowrap hover:cursor-pointer"
					@click="patientSection?.openEditModal()"
				>
					Edit Profile
				</button>
				<button
					class="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
					@click="patientSection?.openRecommendationsModal()"
				>
					Therapist Recommendations
				</button>
			</template>

			<button
				v-if="can('THERAPIST')"
				class="btn text-nowrap hover:cursor-pointer"
				@click="patientSection?.handleNewNote()"
			>
				Write Therapy Notes
			</button>
		</div>

		<!-- Profile Details -->
		<ProfileDetails
			:profile="profile"
			:non-employee="nonEmployee"
			:patient="patient"
			:paid="paid"
		/>

		<!-- Therapy section (notes history + all modals) -->
		<PatientSection
			ref="patientSection"
			:patient-id="uId"
			:profile="profile"
			@profile-updated="getProfile"
		/>
	</div>
</template>

<script setup lang="ts">
import PatientSection from "~/components/patient/Section.vue";

const route = useRoute();
const uId = route.params.id as string;

const { can } = useAccess();
const { profile, nonEmployee, patient, getProfile, paid } =
	usePatientProfile(uId);

const patientSection = ref<InstanceType<typeof PatientSection> | null>(null);

getProfile();
</script>
