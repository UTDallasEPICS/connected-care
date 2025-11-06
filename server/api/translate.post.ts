// server/api/translate.post.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Log what the client sent
    console.log('Outgoing payload to LibreTranslate:', {
        q: body.text,
        source: body.source,
        target: body.target,
        format: 'text'
    })


    try {
    const res = await $fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
            q: body.text,
            source: body.source,
            target: body.target,
            format: 'text'
        }
    })


    console.log('Response from LibreTranslate:', res)

    return res
    } catch (error) {
        console.error('Error from LibreTranslate:', error)
        return { error: 'Translation failed' }
    }
})
