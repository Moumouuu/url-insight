import { inject } from '@adonisjs/core'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'

@inject()
export class GetUrlsUsecase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(payload: string): Promise<string[]> {
    return this.urlRepository.getAllForCurrentUser(payload)
  }
}
