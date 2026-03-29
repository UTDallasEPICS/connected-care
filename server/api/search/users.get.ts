// server/api/search/users.get.ts

export default defineEventHandler(async () => {
	const allUsers = await prisma.user.findMany({
		include: {
			NonEmployee: {
				include: {
					Patient: true,
					Children: true,
				},
			},
		},
		orderBy: { lName: "asc" },
	});

	return allUsers.map((u) => {
		let effectiveType: string | null = null;
		if (u.type) {
			effectiveType = u.type;
		} else if (u.NonEmployee?.Patient) {
			effectiveType = "PATIENT";
		} else if (u.NonEmployee?.Children?.length) {
			effectiveType = "PARENT";
		}

		return {
			id: u.id,
			name: formatFullName(u.fName, u.mInit, u.lName),
			email: u.email ?? null,
			phone: u.phone ?? null,
			effectiveType,
		};
	});
});
