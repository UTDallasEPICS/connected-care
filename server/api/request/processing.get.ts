import { Status } from "@prisma/client";

export default defineEventHandler(async () => {
	const requests = await prisma.request.findMany({
		where: { status: Status.PROCESSING },
		include: {
			therapies: true,
			complementaryServices: true,
			workshops: true,
			phone: true,
		},
		orderBy: { createdAt: "desc" },
	});
	return requests;
});
