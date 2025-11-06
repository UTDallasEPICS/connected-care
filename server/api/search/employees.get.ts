// server/api/search/employees.get.ts
// Return all employees mapped to a summary object (similar style to server/api/search/all.get.ts)
import { defineEventHandler } from "h3";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async () => {
	// Fetch employees (users with non-null `type`) and include useful relations
	const employeeUsers = await prisma.user.findMany({
		where: {
			AND: [
				{ type: { not: null } }, // must have a type
				{ NonEmployee: null }, // exclude users linked to NonEmployee
			],
		},
		include: {
			Specializations: true,
			Sessions: true,
		},
		orderBy: { lName: "asc" },
	});

	return employeeUsers.map((u) => {
		// build full name
		const name = [u.fName, u.mInit ? `${u.mInit}.` : null, u.lName]
			.filter(Boolean)
			.join(" ");

		return {
			id: u.id,
			name,
			email: u.email ?? null,
			phone: u.phone ?? null,
			whatsApp: u.whatsApp ?? null,
			contactPref: u.contactPref ?? null,
			type: u.type ?? null,
			specializations: (u.Specializations || []).map((s) => s.name),
			sessions: (u.Sessions || []).map((s) => ({
				id: s.id,
				time: s.time,
				duration: s.duration,
			})),
		};
	});
});
