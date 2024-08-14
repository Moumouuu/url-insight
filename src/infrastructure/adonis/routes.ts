/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const SessionController = () => import('#controllers/session_controller')
import { middleware } from '#infrastructure/adonis/kernel'
const HomeController = () => import('#controllers/home_controller')

const TokensController = () => import('#controllers/tokens_controller')
const UrlsController = () => import('#controllers/urls_controller')

router.get('/', [HomeController, 'index']).as('home')
router.post('/login', [SessionController, 'retrieve']).as('login')
router.post('/register', [SessionController, 'store']).as('register')
router.delete('/logout', [SessionController, 'destroy']).as('logout').use(middleware.auth())

router
  .group(() => {
    // Routes for authenticated users
    router.get('/me', [TokensController, 'retrieve']).as('me')

    router.get('/urls', [UrlsController, 'retrieve']).as('urls')
    router.get('/urls/:url', [UrlsController, 'retrieveOne']).as('urls.retrieve')
    router.post('/urls', [UrlsController, 'store']).as('urls.store')
    router.post('/urls/:url/increment', [UrlsController, 'increment']).as('urls.increment')
    router.delete('/urls/:url', [UrlsController, 'destroy']).as('urls.destroy')
  })
  .use(middleware.auth())
  .prefix('/api/v1')
