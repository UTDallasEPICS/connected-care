export function formatFullName(
	fName: string,
	mInit: string | null | undefined,
	lName: string
): string {
	return [fName, mInit ? `${mInit}.` : null, lName].filter(Boolean).join(" ");
}
