import { AccessPermission as AP } from "~/types/permissions";

type Route = {
	to: string;
	params?: {
		id: string;
	};
	label: string;
};

type AccessVal = {
	[id: string]: boolean;
};

// Assumes userId are always valid - This needs a slight rework to account for it possibly being null
// This code feels messy/redundant - Rewrite appreciated :)
export function useUserLinks() {
	const { userId, access } = useAuthState();

	const userLinks = computed(() => {
		const legalRoutes: Route[] = [];
		const val: AccessVal | null = access.value;

		// protect against undefined access throwind error
		if (!val) {
			return legalRoutes;
		}
		console.log(val[AP.USER]);
		// add relevant links
		if (val[AP.USER]) {
			legalRoutes.push({ to: "admin-scheduleView", label: "Schedule" });
		}
		if (val[AP.PATIENT]) {
			if (userId.value)
				legalRoutes.push({
					to: "myProfile-id",
					params: { id: userId.value },
					label: "Profile",
				});
		}
		if (val[AP.PARENT]) {
			legalRoutes.push({ to: "childSearch", label: "Children" });
		}
		if (val[AP.STAFF]) {
			legalRoutes.push({
				to: "patient-patientSearch",
				label: "Patients",
			});
			legalRoutes.push({
				to: "patient-viewContactForms",
				label: "Review Forms",
			});
		}
		if (val[AP.ADMIN]) {
			legalRoutes.push({
				to: "admin-employeeSearch",
				label: "Employees",
			});
		}
		return legalRoutes;
	});

	return { userLinks };
}
