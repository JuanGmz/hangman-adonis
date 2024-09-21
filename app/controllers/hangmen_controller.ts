import type { HttpContext } from '@adonisjs/core/http'
import { hangmanValidator } from '#validators/hangman'

export default class HangmenController {

    public async hangman({ response }: HttpContext) {
        // Generar una palabra aleatoria
        const palabras = ['javascript', 'python', 'java', 'php', 'c++', 'c#', 'ruby', 'go', 'swift', 'kotlin']
        const indiceAleatorio = Math.floor(Math.random() * palabras.length)
        const palabra: String = palabras[indiceAleatorio]

        // Seleccionar el número de intentos
        const intentos: number = 5

        // Array para las letras acertadas
        const letrasAcertadas: String[] = []

        // Enviar las cookies
        response.cookie('palabra', palabra)
        response.cookie('intentos', intentos)
        response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))

        // Mensaje de inicio al juego
        return response.status(200).json({
            "mensaje": "El juego comenzó",
        })
    }

    public async empezar({ request, response }: HttpContext) {
        // Obtener las cookies
        const palabra = request.cookie('palabra')
        let intentos = parseInt(request.cookie('intentos'), 10)
        let letrasAcertadas = JSON.parse(request.cookie('letrasAcertadas') || '[]')

        // Variable para mostrar el progreso
        let progreso = ''

        // Extraer solo el valor de la letra
        const { letra } = request.all()

        // Validar que la letra sea válida
        await hangmanValidator.validate({ letra })

        if (letra) {
            // Verificar si la letra ya fue acertada, si no fue acertada se agrega en el array de letras acertadas
            if (!letrasAcertadas.includes(letra)) {
                letrasAcertadas.push(letra)
            }

            // Verificar si la letra está en la palabra de lo contrario resta un intento
            if (!palabra.includes(letra)) {
                intentos -= 1
            }
        }

        // Recorrer la palabra para concatenar la palabra adivinada o el guion
        for (let i = 0; i < palabra.length; i++) {
            // Si la letra ya fue adivinada, mostrarla
            if (letrasAcertadas.includes(palabra[i])) {
                progreso += palabra[i]
            } else {
                // Si no, mostrar un guion
                progreso += "-"
            }
        }

        // Si la palabra ya fue adivinada, mostrar el mensaje de ganaste
        if (progreso === palabra) {
            // Enviar las cookies
            response.cookie('palabra', palabra)
            response.cookie('intentos', intentos)
            response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))
            return response.status(200).json({
                "mensaje": "Ganaste en el intento: " + intentos,
                "palabra" : palabra,
                "letras enviadas": letrasAcertadas,
            })
        } else if (intentos <= 0) {
            response.cookie('palabra', palabra)
            response.cookie('intentos', intentos)
            response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))
            return response.status(200).json({
                "mensaje" : "Perdiste",
                "palabra" : palabra
            })
        } else {
            response.cookie('palabra', palabra)
            response.cookie('intentos', intentos)
            response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))
            return response.status(200).json({
                "progreso": progreso,
                "intentos": intentos,
                "letras enviadas": letrasAcertadas
            })
        }
    }
}