<template>
	<div class="font-sc-encode p-4">
		<!-- Header -->
		<div class="mb-4">
			<h1 class="font-cormorant-garamond text-2xl font-bold">
				Evaluation Appointment Requests
			</h1>
		</div>

		<!-- Appointments Table -->
		<table class="w-full table-auto border-collapse">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left">Name</th>
					<th class="px-4 py-2 text-left">Email</th>
					<th class="px-4 py-2 text-left">Phone</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="appointment in filteredAppointments"
					:key="appointment.id"
					class="border-t hover:bg-gray-100"
				>
					<td class="px-4 py-2">
						<span class="cursor-pointer text-blue-600 hover:underline">
							{{ appointment.firstName }} {{ appointment.lastName }}
						</span>
					</td>
					<td class="px-4 py-2">{{ appointment.email || "—" }}</td>
					<td class="px-4 py-2">{{ appointment.phone || "—" }}</td>
				</tr>
				<tr v-if="!filteredAppointments.length" class="border-t">
					<td colspan="3" class="px-4 py-2 text-center">
						No evaluation requests found.
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Error State -->
		<div v-if="error" class="mt-4 text-red-600">
			Failed to load appointment requests.
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetch, useCookie } from "#imports";
import { AccessPermission } from "~/types/permissions";

const access = useCookie<Record<AccessPermission, boolean> | null>(
	"AccessPermission"
);

interface Appointment {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	serviceType: string;
}

const { data: appointmentData, error } = await getAppointments();

async function getAppointments() {
	if (access.value?.[AccessPermission.USER_SERVICE]) {
		return useFetch<Appointment[]>("/api/session/appointments");
	}
	return {
		data: { value: [] },
		error: "User not authorized to view appointment requests",
	};
}

// Filter for Requests with Evaluation Service
const filteredAppointments = computed(() => {
	const list: Appointment[] = appointmentData?.value ?? [];
	return list.filter((appointment) => appointment.serviceType === "EVALUATION");
});
</script>
