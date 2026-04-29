import { AccessPermission as AP } from "~/types/permissions";
import { useLocalePath } from "#imports";

export function useDashboardNavigation() {
	// If logged in, go to appropriate dashboard, otherwise go to landing page
	function dashboardNavigation() {
		const { userId, access } = useAuthState();
		const val = access.value;
		const localePath = useLocalePath();

		if (!userId.value || !val) {
			return navigateTo(localePath("index"));
		}

		if (val[AP.ADMIN]) return navigateTo("/admin");
		if (val[AP.USER_SERVICE]) return navigateTo("/userServiceDashboard");
		if (val[AP.PARENT]) return navigateTo("/parentDashboard");
		if (val[AP.PATIENT]) return navigateTo("/patientDashboard");
		if (val[AP.THERAPIST]) return navigateTo("/therapistDashboard");
		if (val[AP.EVALUATOR]) return navigateTo("/dashboard/evaluatorDashboard");

		return navigateTo("/Dashboard");
	}

	return { dashboardNavigation };
}
