import { useLocalePath } from "#imports";
import type { AccessVal } from "~/types/permissions";
import type { CookieRef } from "#app";
export function useAuthState() {
	const userId = useCookie("userId");

	// since for whatever reason access is stored as a JSON object,
	// instead of parsing it each time, it just gets parsed as it comes out of the cookie

	const access: CookieRef<AccessVal | null> = useCookie("AccessPermission");
	const localePath = useLocalePath();
	return { userId, access, localePath };
}
