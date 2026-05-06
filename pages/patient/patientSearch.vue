<template>
	<div class="font-sc-encode p-4">
		<!-- Header + Search -->
		<div class="mb-4 flex items-center">
			<h1 class="font-cormorant-garamond text-2xl font-bold">
				View All Patients
			</h1>

			<div
				class="ml-4 flex flex-1 items-center overflow-hidden rounded border border-gray-300"
			>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search by name..."
					class="flex-1 px-3 py-2 focus:outline-none"
				/>
				<button class="px-3">
					<Search class="h-5 w-5" />
				</button>
			</div>
		</div>

		<!-- Patients Table (REFERRALS ONLY) -->
		<table class="w-full table-auto border-collapse">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left">Name</th>
					<th class="px-4 py-2 text-left">Age</th>
					<th class="px-4 py-2 text-left">Gender</th>
				</tr>
			</thead>

			<tbody>
				<tr
					v-for="ref in filteredReferrals"
					:key="ref.id"
					class="cursor-pointer border-t hover:bg-gray-100"
					@click="openModal(ref)"
				>
					<td class="px-4 py-2">{{ ref.patient.name }}</td>
					<td class="px-4 py-2">{{ ref.patient.age ?? "—" }}</td>
					<td class="px-4 py-2">{{ ref.patient.gender ?? "—" }}</td>
				</tr>

				<tr v-if="!filteredReferrals.length" class="border-t">
					<td colspan="3" class="px-4 py-2 text-center">
						No patients found.
					</td>
				</tr>
			</tbody>
		</table>

		<!-- MODAL -->
		<PatientModal
			v-if="is_clicked && selectedItem"
			:patient="{
				id: selectedItem.patient.id,
				name: selectedItem.patient.name,
				gender: selectedItem.patient.gender,
				age: selectedItem.patient.age,
				identification: selectedItem.patient.identification,

				email: selectedItem.patient.email,
				phone: selectedItem.patient.phone,
				whatsApp: selectedItem.patient.whatsApp,
				contactPref: selectedItem.patient.contactPref,

				diagnosed: selectedItem.patient.diagnosed,
				sponsorId: selectedItem.patient.sponsorId
			}"
			:therapist="selectedItem.therapist"
			:therapyRecommendation="selectedItem.therapyRecommendation"
			:therapistType="selectedItem.therapistType"
			:createdAt="selectedItem.createdAt"
			@close="is_clicked = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search } from "lucide-vue-next";
import PatientModal from "~/components/therapy/PatientModal.vue";

/* AUTH */
const { userId } = useAuthState();

/* STATE */
const searchQuery = ref("");
const is_clicked = ref(false);
const selectedItem = ref<any>(null);

/* FETCH REFERRALS (THIS IS THE ONLY DATA SOURCE YOU NEED) */
const { data: referrals } = await useFetch("/api/session/referrals");

/* SEARCH FILTER */
const filteredReferrals = computed(() => {
	if (!referrals.value) return [];

	return referrals.value.filter((r: any) =>
		r.patient.name
			.toLowerCase()
			.includes(searchQuery.value.toLowerCase())
	);
});

/* OPEN MODAL */
function openModal(ref: any) {
	selectedItem.value = ref;
	is_clicked.value = true;
}
</script>
