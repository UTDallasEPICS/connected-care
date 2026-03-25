import { ref, computed } from "vue";
import { useFetch } from "#imports";

export function usePatientProfile(patientId: string) {
	const profile = ref<Record<string, unknown>>({});

	async function getProfile() {
		const { data } = await useFetch("/api/profile/patient", {
			query: { id: patientId },
		});
		profile.value = (data.value as Record<string, unknown>) ?? {};
	}

	const nonEmployee = computed(
		() => (profile.value?.NonEmployee as Record<string, unknown>) ?? {}
	);
	const patient = computed(
		() => (nonEmployee.value?.Patient as Record<string, unknown>) ?? {}
	);

	const paid = computed(() => {
		const appointments = patient.value?.Appointments as
			| Array<{ paid: boolean }>
			| undefined;
		if (appointments) {
			return appointments.every((s) => s.paid);
		}
		return false;
	});

	return {
		profile,
		nonEmployee,
		patient,
		getProfile,
		paid,
	};
}
