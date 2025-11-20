// server/api/session/therapyNotes.get.ts
import { defineEventHandler, getQuery } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { patientId } = getQuery(event) as { patientId?: string };

	if (!patientId) {
		event.node.res.statusCode = 400;
		return { success: false, error: "patientId is required" };
	}

	const notes = await prisma.therapyNote.findMany({
		where: { patientId: String(patientId) },
		include: {
			objectives: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return {
		success: true,
		data: notes,
	};
});
