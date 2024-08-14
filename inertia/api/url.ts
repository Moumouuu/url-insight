import { Url } from '~/models/url'
import { PATH_API } from '~/utils/api'

export class UrlAPI {
  static async create(payload: Url) {
    return fetch(`${PATH_API}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }
}
