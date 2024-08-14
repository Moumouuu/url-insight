import type { ApplicationService } from '@adonisjs/core/types'
import { UserRepository } from '#domain/contracts/repositories/user_repository'
import DbUserRepository from '#infrastructure/postgres/repositories/user_repository_postgres'
import { UrlRepository } from '#domain/contracts/repositories/url_repository'
import UrlRepositoryRedis from '#infrastructure/redis/repositories/url_repository_redis'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.bind(UserRepository, () => new DbUserRepository())
    this.app.container.bind(UrlRepository, () => new UrlRepositoryRedis())
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
