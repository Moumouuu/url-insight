import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

const SEPARATOR = '-'

export default class UrlsController {
  // todo use hexagonal architecture
  // todo : use token from user to authenticate the request (instead of user id)

  async retrieve({ auth }: HttpContext) {
    const payloadKey = `${auth.getUserOrFail().id}${SEPARATOR}*`

    // get all geys for the user
    const keys = await redis.keys(payloadKey)

    // get the values for each key
    return keys.map((key) => {
      const value = redis.get(key)
      return { url: key.split(SEPARATOR)[1], value }
    })
  }

  async retrieveOne({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().id}${SEPARATOR}${url}`

    const value = await redis.get(key)

    if (!value) {
      return response.json({ message: 'Url not found' })
    }

    return { url, value }
  }

  async store({ request, auth }: HttpContext) {
    const payload = request.only(['url'])
    const key = `${auth.getUserOrFail().id}${SEPARATOR}${payload.url}`

    await redis.set(key, 0)
  }

  async destroy({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().id}${SEPARATOR}${url}`

    const value = await redis.get(key)

    if (value) {
      return redis.del(key)
    }

    return response.json({ message: 'Url not found' })
  }

  async increment({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().id}${SEPARATOR}${url}`

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
  // url = https:%20%20www.google.com -> https://www.google.com
  return decodeURIComponent(url.replace(/%20/g, '/'))
}
