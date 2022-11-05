import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { LoginResult, LogoutResult } from "./api.types"

export class AuthenticationApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async login(emailAddress: string, password: string): Promise<LoginResult> {
    try {
      const authData = {
        identifier: emailAddress,
        password: `${password}`,
      }
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/api/auth/local",
        JSON.stringify(authData),
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", jwt: response?.data?.jwt, id: response?.data?.user?.id }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async logout(): Promise<LogoutResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch("/Authentication/log-out")

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok" }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
