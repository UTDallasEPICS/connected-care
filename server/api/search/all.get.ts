// server/api/users/index.get.ts

export default defineEventHandler(async () => {
	const patientUsers = await prisma.user.findMany({
		where: {
			NonEmployee: {
				// only keep NonEmployees which themselves have a Patient record
				Patient: { isNot: null },
			},
		},
		include: {
			NonEmployee: {
				include: {
					Patient: true,
				},
			},
		},
	});

	return patientUsers.map((u) => {
		const ne = u.NonEmployee!;
		const patient = ne.Patient!;
		return {
			id: u.id,
			name: formatFullName(u.fName, u.mInit, u.lName),
			type: u.type ?? "",
			age: ne.dob ? computeAge(ne.dob) : null,
			gender: ne.gender,
			identification: patient.identification,
			diagnosed: patient.diagnosed,
			sponsorId: patient.sponsorId,
			email: u.email,
			phone: u.phone,
			whatsApp: u.whatsApp,
			contactPref: u.contactPref,
		};
	});
});
