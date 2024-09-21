import type { HttpContext } from '@adonisjs/core/http'
import { hangmanValidator } from '#validators/hangman'

export default class HangmenController {

    public async hangman({ response }: HttpContext) {
        const palabras = ['javascript']
        const indiceAleatorio = Math.floor(Math.random() * palabras.length)
        const palabra: String = palabras[indiceAleatorio]
        const intentos: number = 5
        const letrasAcertadas: String[] = []

        // Enviar las cookies
        response.cookie('palabra', palabra)
        response.cookie('intentos', intentos)
        response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))

        return response.status(200).json({
            "mensaje": "El juego comenzó",
            palabra
        })
    }

    public async empezar({ request, response }: HttpContext) {
        const palabra = request.cookie('palabra');
        let intentos = parseInt(request.cookie('intentos'), 10);
        let letrasAcertadas = JSON.parse(request.cookie('letrasAcertadas') || '[]');

        // Variable para mostrar el progreso
        let progreso = '';

        // Validar que la letra sea válida
        const letra = request.all();
        await hangmanValidator.validate(letra);

        if (letra) {
            // Verificar si la letra ya fue acertada
            if (!letrasAcertadas.includes(letra)) {
                letrasAcertadas.push(letra);
            }

            // Verificar si la letra está en la palabra
            if (!palabra.includes(letra)) {
                intentos -= 1;
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

        if (progreso === palabra) {
            response.cookie('palabra', palabra)
            response.cookie('intentos', intentos)
            response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))
            return response.status(200).json({
                "mensaje": "Ganaste"
            })
        } else if (intentos <= 0) {
            response.cookie('palabra', palabra)
            response.cookie('intentos', intentos)
            response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))
            return response.status(200).json({
                "mensaje": "Perdiste"
            })
        } else {
            response.cookie('palabra', palabra)
            response.cookie('intentos', intentos)
            response.cookie('letrasAcertadas', JSON.stringify(letrasAcertadas))
            return response.status(200).json({
                "progreso": progreso,
                "intentos": intentos,
                "letras enviadas": letrasAcertadas,
                palabra
            })
        }
    }
}