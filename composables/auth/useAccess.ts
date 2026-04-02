import { AccessPermission as AP } from "~/types/permissions";

export function useAccess() {
	const { access } = useAuthState();

	function can(role: keyof typeof AP): boolean {
		return access.value?.[AP[role]] ?? false;
	}

	return { can };
}
