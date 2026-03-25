import { z } from "zod";

const schema = z.object({
	pId: z.string(),
});

const validateSchema = schema.strict();

export default defineEventHandler(async (event) => {
	const { pId } = await validateQuery(event, validateSchema);

	const parent = await prisma.user.findUnique({
		where: { id: pId },
		include: {
			NonEmployee: {
				include: { Children: { select: { id: true } } },
			},
		},
	});

	if (!parent?.NonEmployee?.Children) {
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to find children for user: ${parent?.id}`,
		});
	}
	return parent.NonEmployee.Children.map((c) => c.id);
});
