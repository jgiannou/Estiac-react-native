import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetUserResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getUser(password: string, email: string): Promise<any> {
    try {
      const authData = {
        identifier: email,
        password: `${password}`,
      }
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/api/auth/local`,
        JSON.stringify(authData),
      )
      // the typical ways to die when calling an api
      console.log(response.data)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = {
        id: response?.data?.user?.id,
        username: response?.data?.user?.username,
        email: response?.data?.user?.email,
        avatarSrc: response?.data?.user?.avatar,
        jwt: response?.data?.jwt,
        status: response?.ok,
      }
      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
