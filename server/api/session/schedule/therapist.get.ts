import { z } from "zod";

const schema = z.object({
	userId: z.string(),
	date: z.coerce.date(),
});

const validateSchema = schema.strict();

export default defineEventHandler(async (event) => {
	const { userId, date } = await validateQuery(event, validateSchema);

	const { monday, saturday } = getWeekBounds(date);

	const sessions = await prisma.session.findMany({
		where: {
			time: { gte: monday, lt: saturday },
			therapistId: userId,
		},
		include: sessionWithDetailsInclude,
	});

	return sessions;
});
