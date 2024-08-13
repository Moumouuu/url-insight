import { User } from '#domain/models/user_model.js'
import { CreateUserDto } from '#domain/contracts/dto/create_user_dto.js'

export abstract class UserRepository {
  abstract save(user: CreateUserDto): Promise<User>
}
