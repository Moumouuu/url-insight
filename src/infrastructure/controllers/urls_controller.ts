
import { HttpContext } from "@adonisjs/core/http";

export default class UrlsController {
  async retrieve({ auth }: HttpContext) {
    // todo : get all urls
  }

  async store({ auth }: HttpContext) {
  // todo : create new url
  }

  async destroy({ auth }: HttpContext) {
  // todo : delete url
  }
}
