import { User } from '#domain/models/user_model'
import { CreateUserDto } from '#domain/contracts/dto/create_user_dto'

export abstract class UserRepository {
  abstract save(user: CreateUserDto): Promise<User>
}
