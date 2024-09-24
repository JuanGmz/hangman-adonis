import HangmenController from '#controllers/hangmen_controller'
import router from '@adonisjs/core/services/router'

router.post('/hangman/:indice/:jugar?', [HangmenController, 'jugar'])
.where('indice', '([0-9]+)')