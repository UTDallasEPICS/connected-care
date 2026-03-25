export default defineEventHandler(async () => {
	const therapists = await prisma.user.findMany({
		where: { type: "THERAPIST" },
		select: {
			id: true,
			fName: true,
			lName: true,
		},
		orderBy: { lName: "asc" },
	});

	// return an array of { id, fName, lName }
	return therapists;
});
