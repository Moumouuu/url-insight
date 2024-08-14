export abstract class UrlRepository {
  abstract getAllForCurrentUser(user: string): Promise<string[]>
}
