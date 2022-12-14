import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"
import { User } from "../../models/user/user"

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem

export type LoginResult = { kind: "ok"; jwt: string; id: number } | GeneralApiProblem
export type LogoutResult = { kind: "ok" } | GeneralApiProblem

export type RegisterResult = { kind: "ok"; jwt: string; id: number } | GeneralApiProblem
