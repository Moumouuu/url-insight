import { User } from '~/models/user'

export class UserAPI {
  static async register(payload: User) {
    return fetch(`/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  static async login(payload: User) {
    return fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  static async logout() {
    return fetch(`/logout`, {
      method: 'DELETE',
    })
  }
}
