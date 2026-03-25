import { $fetch } from "ofetch";
import type { Ref } from "vue";

export function useProfileSave(
	patientId: string,
	profile: Ref<Record<string, unknown>>,
	onDone: () => Promise<void>
) {
	async function saveProfile(formData: Record<string, unknown>) {
		const address = String(formData.address ?? "");
		const addressParts = address.split(" ");
		const streetNum = addressParts[0] ? Number(addressParts[0]) : 0;
		const streetName = addressParts.slice(1).join(" ");

		const ne =
			(profile.value?.NonEmployee as Record<string, unknown>) ?? {};
		const pt = (ne?.Patient as Record<string, unknown>) ?? {};

		await $fetch("/api/profile/patient", {
			method: "Put",
			body: {
				id: patientId,
				fName: formData.firstName,
				mInit: formData.middleName || "",
				lName: formData.lastName,
				gender: formData.gender,
				dob: new Date(String(formData.DOB)).toISOString(),
				streetName,
				streetNum,
				buildingNum: formData.buildNum,
				postcode: formData.postcode,
				identification: pt?.identification,
				city: formData.city,
				email: formData.email,
				phone: formData.phone,
				whatsapp: formData.whatsapp,
				isDiagnosed: pt?.diagnosed,
			},
		});
		await onDone();
	}

	return { saveProfile };
}
