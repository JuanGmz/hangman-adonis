import vine from '@vinejs/vine'

export const hangmanValidator = vine.compile(
    vine.object({
      letra: vine.string().trim().maxLength(1),
    })
  )