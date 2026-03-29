interface UserSearchResult {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	effectiveType: string | null;
}

export function useUserSearch() {
	const searchQuery = ref("");
	const typeFilter = ref<string>("ALL");

	const { data: users, error } =
		useFetch<UserSearchResult[]>("/api/search/users");

	const filteredUsers = computed(() => {
		const list: UserSearchResult[] = users.value ?? [];
		return list.filter((u) => {
			const matchesSearch = u.name
				.toLowerCase()
				.includes(searchQuery.value.toLowerCase());
			const matchesType =
				typeFilter.value === "ALL" ||
				u.effectiveType === typeFilter.value;
			return matchesSearch && matchesType;
		});
	});

	const typeOptions = [
		{ label: "All Types", value: "ALL" },
		{ label: "Admin", value: "ADMIN" },
		{ label: "Therapist", value: "THERAPIST" },
		{ label: "User Service", value: "USER_SERVICE" },
		{ label: "Patient", value: "PATIENT" },
		{ label: "Parent", value: "PARENT" },
	];

	return {
		searchQuery,
		typeFilter,
		typeOptions,
		filteredUsers,
		error,
	};
}
