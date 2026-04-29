type TherapistReferralFindManyDelegate = {
	findMany: () => Promise<unknown>;
};

function getTherapistReferralDelegate(): TherapistReferralFindManyDelegate {
	const delegate = (prisma as unknown as Record<string, unknown>)[
		"therapistReferral"
	];

	if (!delegate || typeof delegate !== "object") {
		throw createError({
			statusCode: 500,
			statusMessage:
				"TherapistReferral model is not available in Prisma client.",
		});
	}

	const typed = delegate as Partial<TherapistReferralFindManyDelegate>;
	if (typeof typed.findMany !== "function") {
		throw createError({
			statusCode: 500,
			statusMessage:
				"TherapistReferral model is not available in Prisma client.",
		});
	}

	return typed as TherapistReferralFindManyDelegate;
}

export default defineEventHandler(async () => {
	const therapistReferral = getTherapistReferralDelegate();
	return await therapistReferral.findMany();
});
