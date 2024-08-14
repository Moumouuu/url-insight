import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UrlRepositoryRedis from '#infrastructure/redis/repositories/url_repository_redis'
import { SEPARATOR } from '#controllers/urls_controller'
import redis from '@adonisjs/redis/services/main'

@inject()
export default class HomeController {
  constructor(private urlRepository: UrlRepositoryRedis) {}

  async index({ inertia, auth }: HttpContext) {
    let user = null
    let keys: any = []

    if (await auth.check()) {
      user = await auth.authenticate()

      const payloadKey = `${user?.token}${SEPARATOR}*`
      keys = await this.urlRepository.getAllForCurrentUser(payloadKey)

      const getKeys = async () => {
        const keyPromises = keys.map(async (key: string) => {
          const views = await redis.get(key)
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
