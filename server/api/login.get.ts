import { z } from "zod";

const schema = z.object({
	email: z.string().email(),
});

const validateSchema = schema.strict().required();

export default defineEventHandler(async (event) => {
	const { email } = await validateQuery(event, validateSchema);

	// find user with email
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!user) {
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to find user for email: ${email}`,
		});
	}
	setCookie(event, "userId", user.id);
	return `Successful login for user ${email}:${user.id}`;
});
