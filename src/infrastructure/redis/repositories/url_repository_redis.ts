import { UrlRepository } from '#domain/contracts/repositories/url_repository'
import redis from '@adonisjs/redis/services/main'

export default class UrlRepositoryRedis implements UrlRepository {
  getAllForCurrentUser(payloadKey: string): Promise<string[]> {
    return redis.keys(payloadKey)
  }
}
