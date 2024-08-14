import { inject } from '@adonisjs/core'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'

@inject()
export class GetUrlUsecase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(payload: string): Promise<string | null> {
    return this.urlRepository.getOneForCurrentUser(payload)
  }
}
