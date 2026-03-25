<template>
	<div class="font-sc-encode p-4">
		<div class="mb-4 flex items-center">
			<h1 class="font-cormorant-garamond text-2xl font-bold">
				View All Users
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
			<select
				v-model="typeFilter"
				class="ml-4 rounded border border-gray-300 px-3 py-2"
			>
				<option
					v-for="opt in typeOptions"
					:key="opt.value"
					:value="opt.value"
				>
					{{ opt.label }}
				</option>
			</select>
		</div>

		<!-- Users Table -->
		<SearchUserTable :users="filteredUsers" @select="goToProfile" />

		<!-- Error State -->
		<div v-if="error" class="mt-4 text-red-600">Failed to load users.</div>
	</div>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";

const { searchQuery, typeFilter, typeOptions, filteredUsers, error } =
	useUserSearch();

const goToProfile = async (user: {
	id: string;
	effectiveType: string | null;
}) => {
	const staffTypes = ["ADMIN", "THERAPIST", "USER_SERVICE"];
	if (user.effectiveType === "PATIENT") {
		await navigateTo({
			name: "patientProfile-id",
			params: { id: user.id },
		});
	} else if (user.effectiveType && staffTypes.includes(user.effectiveType)) {
		await navigateTo({
			name: "employees-id",
			params: { id: user.id },
		});
	}
};
</script>
