/**
 * Format a date value into a human-readable locale string.
 * Used across therapy notes, recommendations, and view modals.
 */
export function formatDate(value?: string | Date | null): string {
	if (!value) return "No date";
	const d = new Date(value);
	if (isNaN(d.getTime())) return "No date";

	return d.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}
