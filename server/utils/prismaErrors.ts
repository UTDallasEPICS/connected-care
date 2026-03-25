import { Prisma } from "@prisma/client";

export function handlePrismaError(e: unknown): never {
	if (e instanceof Prisma.PrismaClientKnownRequestError) {
		switch (String(e.code)) {
			case "P2002":
				throw createError({
					statusCode: 400,
					statusMessage: "Schema Uniqueness Constraint Violated",
					data: e.meta,
				});
			case "P2005":
			case "P2006":
				throw createError({
					statusCode: 400,
					statusMessage: "Wrong input type",
					data: e.meta,
				});
			case "P2011":
			case "P2012":
			case "P2013":
				throw createError({
					statusCode: 400,
					statusMessage: "Missing required fields",
					data: e.meta,
				});
			case "P2025":
				throw createError({
					statusCode: 404,
					statusMessage: "Record not found",
					data: e.meta,
				});
			default:
				throw createError({
					statusCode: 400,
					statusMessage: "Unexpected Prisma error",
					data: e.meta,
				});
		}
	}
	throw e;
}
