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

		<!-- Patients Table -->
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
					v-for="patient in filteredPatients"
					:key="patient.id"
					class="cursor-pointer border-t hover:bg-gray-100"
					@click="openModal(patient)"
				>
					<td class="px-4 py-2">{{ patient.name }}</td>
					<td class="px-4 py-2">{{ patient.age ?? "—" }}</td>
					<td class="px-4 py-2">{{ patient.gender ?? "—" }}</td>
				</tr>

				<tr v-if="!filteredPatients.length" class="border-t">
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
				id: selectedItem.id,
				name: selectedItem.name,
				gender: selectedItem.gender,
				age: selectedItem.age,
				identification: selectedItem.identification,

				email: selectedItem.email,
				phone: selectedItem.phone,
				whatsApp: selectedItem.whatsApp,
				contactPref: selectedItem.contactPref,

				diagnosed: selectedItem.diagnosed,
				sponsorId: selectedItem.sponsorId,
			}"
			@close="is_clicked = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search } from "lucide-vue-next";
import PatientModal from "~/components/therapy/PatientModal.vue";

interface Patient {
	id: string;
	name: string;
	age: number | null;
	gender: string;
	identification: string;
	diagnosed: boolean;
	sponsorId: string | null;
	email: string;
	phone: string;
	whatsApp: string | null;
	contactPref: string;
}

/* STATE */
const searchQuery = ref("");
const is_clicked = ref(false);
const selectedItem = ref<Patient | null>(null);

/* FETCH PATIENTS */
const { data: patients } = await useFetch<Patient[]>("/api/search/all");

/* SEARCH FILTER */
const filteredPatients = computed(() => {
	if (!patients.value) return [];

	return patients.value.filter((p) =>
		p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

/* OPEN MODAL */
function openModal(patient: Patient) {
	selectedItem.value = patient;
	is_clicked.value = true;
}
</script>
