import type { HttpContext } from '@adonisjs/core/http'
import { hangmanValidator } from '#validators/hangman'

export default class HangmenController {

    public async jugar({ response, params, request }: HttpContext) {
        const palabras = ['javascript', 'python', 'java', 'php', 'c++', 'c#', 'ruby', 'go', 'swift', 'kotlin']
        const indice: number = parseInt(params.indice)
        const palabra = palabras[indice]
        const jugar: boolean = params.jugar

        if (palabra) {
            if (jugar) {

                const letrasEnviadas: string[] = []
                let intentos = 6
                let progreso = ''

                const { letras } = request.all()

                await hangmanValidator.validate({ letras })

                letras.forEach((letra: string) => {
                    if (!letrasEnviadas.includes(letra)) {
                        letrasEnviadas.push(letra)

                        if (!palabra.includes(letra)) {
                            intentos -= 1
                        }
                    }

                })

                for (let i = 0; i < palabra.length; i++) {
                    if (letrasEnviadas.includes(palabra[i])) {
                        progreso += palabra[i]
                    } else {
                        progreso += "-"
                    }
                }

                if (progreso === palabra) {
                    return response.status(200).json({
                        message: 'Ganaste!',
                        palabra
                    })
                } else if (intentos === 0) {
                    return response.status(200).json({
                        message: 'Perdiste!' + ' La palabra era: ' + palabra,
                    })
                } else {
                    return response.status(200).json({
                        progreso,
                        intentos,
                        letrasEnviadas,
                    })
                }

            } else {
                return response.status(200).json({
                    "mensaje": "El juego ha comenzado!",
                })
            }

        } else {
            return response.status(404).json({
                error: 'Palabra no encontrada'
            })
        }
    }
}