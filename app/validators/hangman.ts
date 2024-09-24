import vine from '@vinejs/vine'

export const hangmanValidator = vine.compile(
    vine.object({
      letras: vine.array(vine.string().minLength(1))
    })
)