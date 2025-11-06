// server/api/translate.ts
import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const response = await axios.post(
      'https://libretranslate.com/translate',
      {
        q: body.q,
        source: body.source || 'en',
        target: body.target || 'es'
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    return response.data
  } catch (error: any) {
    console.error('Server proxy error:', error.response?.data || error.message)
    return { error: 'Translation failed' }
  }
})
