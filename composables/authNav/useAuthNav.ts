export function useAuthNav() {
	const { userLinks } = useUserLinks();
	const { logout } = useLogout();
	const { dashboardNavigation } = useDashboardNavigation();

	return { userLinks, logout, dashboardNavigation };
}
