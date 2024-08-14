import { inject } from '@adonisjs/core'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'

@inject()
export class SetUrlUsecase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(payload: string): Promise<string | null> {
    return this.urlRepository.setOneForCurrentUser(payload)
  }
}
