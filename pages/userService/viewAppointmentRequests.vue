<template>
    <div class = "font-sc-encode p-4">
        <!-- Appointments Table -->
		<table class="w-full table-auto border-collapse">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left">Name</th>
					<th class="px-4 py-2 text-left">Type</th>
					<th class="px-4 py-2 text-left">Email</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="appoinment in getAppointments"
					:key="appointment.id"
					class="cursor-pointer border-t hover:bg-gray-100"
					@click="openAppointmentModule(appointment.id)"
				>
					<td class="px-4 py-2">{{ appointment.name }}</td>
					<td class="px-4 py-2">{{ appointment.type || "—" }}</td>
					<td class="px-4 py-2">{{ appointment.email || "—" }}</td>
				</tr>
                <tr v-if="!getAppointments.length" class="border-t">
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
import { Search } from "lucide-vue-next";
import { AccessPermission } from "~/types/permissions";

const access = useCookie<Record<AccessPermission, boolean> | null>(
	"AccessPermission"
);

interface Appointment {
	
    name: string;
    email: string;

    
    /*id: string;
	name: string;
	type: string | null;
	contactPref: string | null;
	email: string | null;*/
}

const { data: usersData, error } = await getAppointments();

async function getAppoitments() {
	if (access.value?.[AccessPermission.USER_SERVICE]) {
		return useFetch<User[]>("/api/search/employees");
	}
	return {
		data: { value: [] },
		error: "User not authorized to view appointment requests",
	};
}

</script>