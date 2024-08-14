import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import { inject } from '@adonisjs/core'
import UrlRepositoryRedis from '#infrastructure/redis/repositories/url_repository_redis'

export const SEPARATOR = '-'

@inject()
export default class UrlsController {
  constructor(private urlRepository: UrlRepositoryRedis) {}

  async retrieve({ auth }: HttpContext) {
    const payloadKey = `${auth.getUserOrFail().token}${SEPARATOR}*`

    //const keys = await redis.keys(payloadKey)
    const keys = await this.urlRepository.getAllForCurrentUser(payloadKey)

    // get the values for each key
    return keys.map((key) => {
      const value = redis.get(key)
      return { url: key.split(SEPARATOR)[1], value }
    })
  }

  async retrieveOne({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${url}`

    const value = await redis.get(key)

    if (!value) {
      return response.json({ message: 'Url not found' })
    }

    return { url, value }
  }

  async store({ request, auth }: HttpContext) {
    const payload = request.only(['url'])
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${payload.url}`

    await redis.set(key, 0)
  }

  async destroy({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${url}`

    const value = await redis.get(key)

    if (value) {
      return redis.del(key)
    }

    return response.json({ message: 'Url not found' })
  }

  async increment({ params, response, auth }: HttpContext) {
    // todo : verify the bearer token is valid

    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${url}`

    // verify the key exists
    const value = await redis.get(key)

    if (value) {
      return redis.incr(key)
    }

    return response.json({ message: 'Url not found' })
  }
}

function decodeUrl(url: string) {
  // todo move this function
  // todo verif que d'autre caractère spéciaux sont bien gérés
  // url = https:%20%20www.google.com -> https://www.google.com
  return decodeURIComponent(url.replace(/%20/g, '/'))
}
