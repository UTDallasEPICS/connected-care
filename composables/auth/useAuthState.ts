export function useAuthState() {
	const userId = useCookie("userId");

	// since for whatever reason access is stored as a JSON object,
	// instead of parsing it each time, it just gets parsed as it comes out of the cookie

	const access = useCookie("AccessPermission", {
		default: () => null,
		decode: (v) => (v ? JSON.parse(v) : null),
		encode: (v) => JSON.stringify(v),
	});

	return { userId, access };
}
