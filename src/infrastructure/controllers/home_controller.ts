import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { SEPARATOR } from '#controllers/urls_controller'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'
import UrlService from '#domain/services/url_service'

@inject()
export default class HomeController {
  constructor(
    private urlRepository: UrlRepository,
    private urlService: UrlService
  ) {}

  async index({ inertia, auth }: HttpContext) {
    let user = null
    let keys: any[] = []

    if (await auth.check()) {
      user = await auth.authenticate()

      const payloadKey = `${user?.token}${SEPARATOR}*`
      keys = await this.urlRepository.getAllForCurrentUser(payloadKey)

      keys = await this.urlService.getKeysWithViewCount(keys)
    }

    const data = {
      apiKey: user ? user.token : null,
      isAuthenticated: !!user,
      urls: keys,
    }

    return inertia.render('home', data)
  }
}
