import { z } from "zod";

const schema = z.object({
	pId: z.string(),
});

const validateSchema = schema.strict();

export default defineEventHandler(async (event) => {
	const { pId } = await validateQuery(event, validateSchema);

	const parent = await prisma.user.findUnique({
		where: {
			id: pId,
		},
		include: {
			NonEmployee: {
				include: {
					Children: {
						include: {
							User: {
								include: {
									User: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!parent?.NonEmployee?.Children) {
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to find children for user: ${parent?.id}`,
		});
	}

	const patientUsers = parent.NonEmployee.Children;

	return patientUsers.map((p) => {
		const ne = p.User!;
		const u = ne.User!;
		return {
			id: u.id,
			name: formatFullName(u.fName, u.mInit, u.lName),
			type: u.type ?? "",
			age: ne.dob ? computeAge(ne.dob) : null,
			gender: ne.gender,
		};
	});
});
