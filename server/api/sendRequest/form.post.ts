import { getCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const isLoggedIn = !body.firstName;

  if (!isLoggedIn) {
    const request = await prisma.request.create({
      data: {
        firstName: body.firstName,
        middleName: body.middleName || null,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        whatsapp: body.whatsapp,
        idNumber: body.idNumber,
        services: JSON.stringify(body.services || []),
      },
    });
    return { success: true, request };
  } 
  else {
    const userId = getCookie(event, "userId");

    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
    }

    const request = await prisma.loggedInRequest.create({
      data: {
        services: JSON.stringify(body.services ?? []),
        userId: userId,
      },
    });
    return { success: true, request };
  }
});