import { UserRepository } from '#domain/contracts/repositories/user_repository'
import User from '#models/user'
import { CreateUserDto } from '#domain/contracts/dto/create_user_dto.js'
import vine from '@vinejs/vine'

const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)
export default class DbUserRepository implements UserRepository {
  async save(user: CreateUserDto): Promise<User> {
    const payload = await createUserValidator.validate(user)
    return User.create(payload)
  }
}
