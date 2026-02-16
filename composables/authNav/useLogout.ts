import { useLocalePath } from "#imports";

export function useLogout() {
	const { userId, access } = useAuthState();
	const localePath = useLocalePath();

	async function logout() {
		userId.value = null;
		access.value = null;

		// not having await seems to cause an issue with the order of page components
		//  putting the footer above the page content
		console.log("User logged out");
		await navigateTo(localePath("index"));
	}

	return { logout };
}
