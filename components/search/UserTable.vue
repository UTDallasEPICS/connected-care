<template>
	<div class="mx-auto w-[90%]">
		<table class="w-full table-auto border-collapse">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left">Name</th>
					<th class="px-4 py-2 text-left">ID</th>
					<th class="px-4 py-2 text-left">Phone</th>
					<th class="px-4 py-2 text-left">Email</th>
					<th class="px-4 py-2 text-left">Type</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="user in users"
					:key="user.id"
					class="cursor-pointer border-t hover:bg-gray-100"
					@click="$emit('select', user)"
				>
					<td class="px-4 py-2">{{ user.name }}</td>
					<td class="px-4 py-2">{{ user.id }}</td>
					<td class="px-4 py-2">{{ user.phone || "\u2014" }}</td>
					<td class="px-4 py-2">{{ user.email || "\u2014" }}</td>
					<td class="px-4 py-2">
						{{ user.effectiveType || "\u2014" }}
					</td>
				</tr>
				<tr v-if="!users.length" class="border-t">
					<td colspan="5" class="px-4 py-2 text-center">
						No users found.
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
interface UserRow {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	effectiveType: string | null;
}

defineProps<{
	users: UserRow[];
}>();

defineEmits<{
	select: [user: UserRow];
}>();
</script>
