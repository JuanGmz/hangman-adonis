/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import HangmenController from '#controllers/hangmen_controller'
import router from '@adonisjs/core/services/router'

router.post('/hangman', [HangmenController, 'hangman'])

router.post('/hangman/empezar', [HangmenController, 'empezar'])