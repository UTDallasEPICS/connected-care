import type { H3Event } from "h3";
import type { ZodType } from "zod";

export async function validateQuery<T>(
	event: H3Event,
	schema: ZodType<T>
): Promise<T> {
	const result = schema.safeParse(getQuery(event));
	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			data: result.error.format(),
		});
	}
	return result.data;
}

export async function validateBody<T>(
	event: H3Event,
	schema: ZodType<T>
): Promise<T> {
	const body = await readBody(event);
	const result = schema.safeParse(body);
	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			data: result.error.format(),
		});
	}
	return result.data;
}
