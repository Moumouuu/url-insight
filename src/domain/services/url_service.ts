import { SEPARATOR } from '#controllers/urls_controller'
import { inject } from '@adonisjs/core'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'

@inject()
export default class UrlService {
  constructor(private urlRepository: UrlRepository) {}

  getKeysWithViewCount(keys: string[]): Promise<any[]> {
    const keyPromises = keys.map(async (key: string) => {
      const views = await this.urlRepository.getOneForCurrentUser(key)
      return { url: key.split(SEPARATOR)[1], views }
    })

    return Promise.all(keyPromises)
  }

  decodeUrl(url: string) {
    // url = https:%20%20www.google.com -> https://www.google.com
    return decodeURIComponent(url.replace(/%20/g, '/'))
  }
}
