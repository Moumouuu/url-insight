/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import SessionController from "#controllers/session_controller";
import { middleware } from "#infrastructure/adonis/kernel";
import TokensController from "#controllers/tokens_controller";
import UrlsController from "#controllers/urls_controller";

router.on('/').renderInertia('home')
router.get('/login', [SessionController, 'retrieve']).as('login')
router.post('/register', [SessionController, 'store']).as('register')
router.delete('/logout', [SessionController, 'destroy']).as('logout').use(middleware.auth())


router.group(() => {
  // Routes for authenticated users
  router.get('/me', [TokensController, 'retrieve']).as('me')
  router.get('/urls', [UrlsController, 'retrieve']).as('urls')
  router.post('/urls', [UrlsController, 'store']).as('urls.store')
  router.delete('/urls/:id', [UrlsController, 'destroy']).as('urls.destroy')
}).use(middleware.auth())
