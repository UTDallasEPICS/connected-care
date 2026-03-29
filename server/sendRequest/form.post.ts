import { prisma } from '~/server/db' 
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const request = await prisma.request.create({
      data: {
        firstName: body.firstName,
        middleName: body.middleName || null,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        whatsapp: body.whatsapp,
        idNumber: body.idNumber,
        services: JSON.stringify(body.services || [])
      }
    })

    return { success: true, request }
  } catch (err) {
    console.error(err)
    return { success: false, message: 'Failed to send request' }
  }
})