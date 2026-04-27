const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const BUSINESS_START_MINUTES = 9 * 60;
const BUSINESS_END_MINUTES = 17 * 60;

export function getMissingRequiredFields(
	data: Record<string, unknown>,
	fields: string[]
): string[] {
	const missing: string[] = [];

	for (const field of fields) {
		const value = data[field];
		if (value === null || value === undefined) {
			missing.push(field);
			continue;
		}

		if (typeof value === "string" && value.trim().length === 0) {
			missing.push(field);
		}
	}

	return missing;
}

export function validateScheduledDateTime(input: Date | string): {
	isValid: boolean;
	error?: string;
	date?: Date;
} {
	const date = input instanceof Date ? input : new Date(input);

	if (Number.isNaN(date.getTime())) {
		return { isValid: false, error: "Invalid date/time provided." };
	}

	const now = new Date();
	if (date.getTime() - now.getTime() < ONE_WEEK_MS) {
		return {
			isValid: false,
			error: "Date/time must be at least one week in advance.",
		};
	}

	const day = date.getDay();
	if (day === 0 || day === 6) {
		return {
			isValid: false,
			error: "Date/time must be scheduled on a weekday.",
		};
	}

	const minutes = date.getHours() * 60 + date.getMinutes();
	if (minutes < BUSINESS_START_MINUTES || minutes > BUSINESS_END_MINUTES) {
		return {
			isValid: false,
			error: "Date/time must be between 9:00 and 17:00.",
		};
	}

	return { isValid: true, date };
}
