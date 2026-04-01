import { onMounted } from "vue";
import { navigateTo } from "#imports";
import type { AccessPermission } from "~/types/permissions";

/**
 * Guard a dashboard page by required role.
 * Redirects to /dashboard on mount if the user lacks the permission.
 */
export function useDashboardGuard(
	requiredRole: keyof typeof AccessPermission
) {
	const { can } = useAccess();

	onMounted(() => {
		if (!can(requiredRole)) {
			navigateTo("/dashboard");
		}
	});
}
