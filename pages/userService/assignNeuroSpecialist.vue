<template>
	<div class="font-sc-encode p-4">
		<!-- Header -->
		<div class="mb-2">
			<h1 class="font-cormorant-garamond text-2xl font-bold">
				Assign Neuro Specialist Referrals
			</h1>
		</div>
		<div class="mb-4 flex justify-end">
			<RefreshButton :onRefresh="refreshReferrals" />
		</div>

		<!-- Referral Requests Table -->
		<table class="w-full table-auto border-collapse">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left w-1/5">Patient ID</th>
					<th class="px-4 py-2 text-left w-1/5">Evaluator ID</th>
					<th class="px-4 py-2 text-left w-1/5">Therapist Type</th>
					<th class="px-4 py-2 text-left w-1/5">Recommendation</th>
					<th class="px-4 py-2 text-left w-1/5">Submitted At</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="referral in referrals"
					:key="referral.id"
					class="border-t hover:bg-gray-100"
				>
					<td class="px-4 py-2">
						<span class="cursor-pointer text-blue-600 hover:underline">
							{{ referral.patientId }}
						</span>
					</td>
					<td class="px-4 py-2">{{ referral.evaluatorId || "—" }}</td>
					<td class="px-4 py-2">{{ referral.therapistType || "—" }}</td>
					<td class="px-4 py-2">{{ referral.therapyRecommendation || "—" }}</td>
					<td class="px-4 py-2">{{ formatDate(referral.submittedAt) }}</td>
				</tr>
				<tr v-if="!referrals.length" class="border-t">
					<td colspan="5" class="px-4 py-2 text-center">
						No neuro specialist referrals found.
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Error State -->
		<div v-if="error" class="mt-4 text-red-600">
			Failed to load referral requests.
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RefreshButton from "./refreshButton.vue";
import { useFetch, useCookie } from "#imports";
import { AccessPermission } from "~/types/permissions";

const access = useCookie<Record<AccessPermission, boolean> | null>(
	"AccessPermission"
);

interface ReferralRequest {
	id: string;
	patientId: string;
	evaluatorId: string;
	therapyRecommendation: string;
	therapistType: string;
	submittedAt: string;
}

const { data: referralData, error, refresh: refreshReferralData } = await getReferralRequests();

async function getReferralRequests() {
	if (access.value?.[AccessPermission.USER_SERVICE]) {
		return useFetch<ReferralRequest[]>("/api/session/referrals");
	}
	return {
		data: { value: [] },
		error: "User not authorized to view referral requests",
	};
}

const referrals = computed(() => referralData?.value ?? []);

async function refreshReferrals() {
	await refreshReferralData();
}

function formatDate(value: string) {
	return value ? new Date(value).toLocaleString() : "—";
}
</script>
