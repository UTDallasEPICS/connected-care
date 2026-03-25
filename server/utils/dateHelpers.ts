export function getWeekBounds(date: Date): { monday: Date; saturday: Date } {
	const firstDay =
		date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1);
	const monday = new Date(date.getTime());
	monday.setDate(firstDay);
	monday.setHours(0, 0, 0, 0);
	const saturday = new Date(date.getTime());
	saturday.setDate(firstDay + 5);
	saturday.setHours(0, 0, 0, 0);
	return { monday, saturday };
}

export function computeAge(dob: Date): number {
	return Math.floor((Date.now() - dob.getTime()) / 1000 / 60 / 60 / 24 / 365);
}

export function parseDateOrNull(value?: string | null): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}
