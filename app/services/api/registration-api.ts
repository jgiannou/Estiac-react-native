import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { LoginResult, LogoutResult, RegisterResult } from "./api.types"

export class RegistrationApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async register(
    username: string,
    emailAddress: string,
    password: string,
  ): Promise<RegisterResult> {
    try {
      const registerData = {
        username: username,
        email: emailAddress,
        password: `${password}`,
      }
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/api/auth/register",
        JSON.stringify(registerData),
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
}
