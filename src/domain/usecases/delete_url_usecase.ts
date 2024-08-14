import { UrlRepository } from '#domain/contracts/repositories/url_repository'

export class DeleteUrlUsecase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(payload: string): Promise<number> {
    return this.urlRepository.deleteOneForCurrentUser(payload)
  }
}
