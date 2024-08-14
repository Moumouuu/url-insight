export abstract class UrlRepository {
  abstract getAllForCurrentUser(payload: string): Promise<string[]>
  abstract getOneForCurrentUser(payload: string): Promise<string | null>
  abstract setOneForCurrentUser(payload: string): Promise<string | null>
  abstract deleteOneForCurrentUser(payload: string): Promise<number>
  abstract incrementOneForCurrentUser(payload: string): Promise<number>
}
