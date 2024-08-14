import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'

export const SEPARATOR = '-'

@inject()
export default class UrlsController {
  constructor(private urlRepository: UrlRepository) {}

  async getAll({ auth }: HttpContext) {
    const payloadKey = `${auth.getUserOrFail().token}${SEPARATOR}*`

    const keys = await this.urlRepository.getAllForCurrentUser(payloadKey)

    // todo : share this function with home_controller
    const getKeys = async () => {
      const keyPromises = keys.map(async (key: string) => {
        const views = await this.urlRepository.getOneForCurrentUser(key)
        return { url: key.split(SEPARATOR)[1], views }
      })

      return Promise.all(keyPromises)
    }

    return await getKeys()
  }

  async getOne({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${url}`

    const views = await this.urlRepository.getOneForCurrentUser(key)

    if (!views) {
      return response.json({ message: 'Url not found' })
    }

    return { url, views }
  }

  async create({ request, auth }: HttpContext) {
    const payload = request.only(['url'])
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${payload.url}`

    await this.urlRepository.setOneForCurrentUser(key)
  }

  async delete({ params, response, auth }: HttpContext) {
    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${url}`

    const views = await this.urlRepository.getOneForCurrentUser(key)

    if (!views) {
      return response.json({ message: 'Url not found' })
    }

    await this.urlRepository.deleteOneForCurrentUser(key)
  }

  async increment({ params, request, response, auth }: HttpContext) {
    const headerAuthorization = request.header('Authorization')
    const bearerToken = headerAuthorization?.split(' ')[1]

    // allow to authentify the user (used in API calls for example)
    if (bearerToken !== auth.getUserOrFail().token) {
      return response.json({ message: 'Invalid token' })
    }

    const url = decodeUrl(params.url)
    const key = `${auth.getUserOrFail().token}${SEPARATOR}${url}`

    const views = await this.urlRepository.getOneForCurrentUser(key)

    if (!views) {
      return response.json({ message: 'Url not found' })
    }

    const newViews = await this.urlRepository.incrementOneForCurrentUser(key)
    return { url, views: newViews }
  }
}

function decodeUrl(url: string) {
  // url = https:%20%20www.google.com -> https://www.google.com
  return decodeURIComponent(url.replace(/%20/g, '/'))
}
