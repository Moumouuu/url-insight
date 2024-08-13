import type { HttpContext } from "@adonisjs/core/http";

export default class TokensController {

  async retrieve({ auth }: HttpContext) {
    return auth.getUserOrFail();
  }

}
