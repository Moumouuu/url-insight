import { UrlRepository } from '#domain/contracts/repositories/url_repository'
import redis from '@adonisjs/redis/services/main'

export default class UrlRepositoryRedis implements UrlRepository {
  getAllForCurrentUser(payloadKey: string): Promise<string[]> {
    return redis.keys(payloadKey)
  }

  getOneForCurrentUser(payload: string): Promise<string | null> {
    return redis.get(payload)
  }

  setOneForCurrentUser(payload: string): Promise<string | null> {
    return redis.set(payload, 0)
  }

  deleteOneForCurrentUser(payload: string): Promise<number> {
    return redis.del(payload)
  }

  incrementOneForCurrentUser(payload: string): Promise<number> {
    return redis.incr(payload)
  }
}
