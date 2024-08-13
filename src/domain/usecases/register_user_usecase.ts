import { User } from '#domain/models/user_model'
import { UserRepository } from '#domain/contracts/repositories/user_repository'
import { CreateUserDto } from '#domain/contracts/dto/create_user_dto.js'
import { inject } from '@adonisjs/core'

@inject()
export class RegisterUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: CreateUserDto): Promise<User> {
    const user = new User(payload.email, payload.password)

    return this.userRepository.save(user)
  }
}
