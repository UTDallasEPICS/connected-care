import { ref, computed } from "vue";
import { useFetch } from "#imports";

interface Profile {
	fName?: string;
	mInit?: string;
	lName?: string;
	email?: string;
	phone?: string;
	whatsApp?: string;
	contactPref?: string;
	NonEmployee?: {
		dob?: string;
		gender?: string;
		streetNum?: string | number;
		streetName?: string;
		buildingNum?: string | number;
		postCode?: string;
		PostCodeCity?: {
			city?: string;
		};
		Patient?: {
			identification?: string;
			diagnosed?: boolean;
			diagnosis?: string;
			recordNumber?: string;
			medication?: string;
			allergies?: string;
			diet?: string;
			parentName?: string;
			Appointments?: Array<{ paid: boolean }>;
		};
	};
	[key: string]: unknown;
}

export function usePatientProfile(patientId: string | string[]) {
	const profile = ref<Profile>({} as Profile);

	async function getProfile() {
		const { data: test } = await useFetch("/api/profile/patient", {
			query: { id: patientId },
		});
		profile.value = test.value;
	}

	const paid = computed(() => {
		if (profile.value?.NonEmployee?.Patient?.Appointments) {
			let inFull = true;
			for (const session of profile.value.NonEmployee.Patient
				.Appointments) {
				if (!session.paid) {
					inFull = false;
				}
			}
			return inFull;
		}
		return false;
	});

	const age = computed(() => {
		const dobVal = profile.value?.NonEmployee?.dob;
		if (!dobVal) return "";

		const birth = new Date(dobVal);
		const today = new Date();

		let years = today.getFullYear() - birth.getFullYear();
		const m = today.getMonth() - birth.getMonth();

		if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
			years--;
		}

		return years;
	});

	return {
		profile,
		getProfile,
		paid,
		age,
	};
}
