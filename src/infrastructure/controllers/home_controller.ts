import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { SEPARATOR } from '#controllers/urls_controller'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'

@inject()
export default class HomeController {
  constructor(private urlRepository: UrlRepository) {}

  async index({ inertia, auth }: HttpContext) {
    let user = null
    let keys: any = []

    if (await auth.check()) {
      user = await auth.authenticate()

      const payloadKey = `${user?.token}${SEPARATOR}*`
      keys = await this.urlRepository.getAllForCurrentUser(payloadKey)

      const getKeys = async () => {
        const keyPromises = keys.map(async (key: string) => {
          const views = await this.urlRepository.getOneForCurrentUser(key)
          return { url: key.split(SEPARATOR)[1], views }
        })

        return Promise.all(keyPromises)
      }

      keys = await getKeys()
    }

    const data = {
      apiKey: user ? user.token : null,
      isAuthenticated: !!user,
      urls: keys,
    }

    return inertia.render('home', data)
  }
}
