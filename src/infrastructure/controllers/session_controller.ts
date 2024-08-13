import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { RegisterUserUsecase } from '#domain/usecases/register_user_usecase'
import User from '#models/user'

@inject()
export default class SessionController {
  constructor(private registerUserUsecase: RegisterUserUsecase) {}

  async retrieve({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    response.json({
      token: user.token,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const userAlreadyExists = await User.findBy('email', email)

    if (userAlreadyExists) {
      return response.status(400).json({ message: 'User already exists' })
    }

    const user = await this.registerUserUsecase.execute({ email, password })
    await auth.use('web').login(user as User)

    return response.json({
      user,
    })
  }

  async destroy({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.noContent()
  }
}
