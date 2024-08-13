// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";

export default class SessionController {
  async retrieve({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(["email", "password"]);

    const user = await User.verifyCredentials(email, password);
    await auth.use("web").login(user);

    response.json({
      token: user.token
    });
  }

  async store({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(["email", "password"]);

    const userAlreadyExists = await User.findBy("email", email);
    if (userAlreadyExists) {
      return response.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password });
    await auth.use("web").login(user);

    return response.created({
      token: user.token
    });
  }

  async destroy({ response, auth }: HttpContext) {
    await auth.use("web").logout();
    return response.noContent();
  }

}
