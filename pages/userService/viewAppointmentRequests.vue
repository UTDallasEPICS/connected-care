<template>
    <div class = "font-sc-encode p-4">
        <!-- Appointments Table -->
		<table class="w-full table-auto border-collapse">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left">firstName</th>
					<th class="px-4 py-2 text-left">lastName</th>
					<th class="px-4 py-2 text-left">Email</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="appoinment in filterAppointments"
					:key="appointment.id"
					class="cursor-pointer border-t hover:bg-gray-100"
					@click="openAppointmentModule(appointment.id)"
				>
					<td class="px-4 py-2">{{ appointment.firstName }}</td>
					<td class="px-4 py-2">{{ appointment.lastName || "—" }}</td>
					<td class="px-4 py-2">{{ appointment.email || "—" }}</td>
				</tr>
                <tr v-if="!filterAppointments.length" class="border-t">
					<td colspan="3" class="px-4 py-2 text-center">
						No appointment requests found.
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
	
    firstName: string;
	lastName: string;
    email: string;
	serviceType: string;

}

const { data: appointmentData, error } = await getAppointments();

async function getAppointments() {
	if (access.value?.[AccessPermission.USER_SERVICE]) {
		return useFetch<Appointment[]>("/api/search/employees");
	}
	return {
		data: { value: [] },
		error: "User not authorized to view appointment requests",
	};
}

// Filter for Request with Evaluation Service
const filteredAppointments = computed(() => {
	const list: User[] = usersData?.value ?? [];
	return list.filter((u) =>
		u.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

</script>
