import { computed } from "vue";
import { useFetch } from "#imports";

export function usePatientProfile(patientId: string) {
	// Read straight from useFetch so the client's first render uses the SSR
	// payload; copying into a ref after an await caused hydration mismatches.
	const { data, refresh } = useFetch("/api/profile/patient", {
		query: { id: patientId },
	});
	const profile = computed(
		() => (data.value as Record<string, unknown>) ?? {}
	);

	const nonEmployee = computed(
		() => (profile.value?.NonEmployee as Record<string, unknown>) ?? {}
	);
	const patient = computed(
		() => (nonEmployee.value?.Patient as Record<string, unknown>) ?? {}
	);

	const paid = computed(() => {
		const appointments = patient.value?.Appointments as
			Array<{ paid: boolean }> | undefined;
		if (appointments) {
			return appointments.every((s) => s.paid);
		}
		return false;
	});

	return {
		profile,
		nonEmployee,
		patient,
		getProfile: () => refresh(),
		paid,
	};
}
