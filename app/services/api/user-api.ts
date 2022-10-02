import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetUserResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getUser(password: string, email: string): Promise<GetUserResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/users?password=${password}&email=${email}`,
      )
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = {
        password: response.data[0].password,
        name: response.data[0].name,
        username: response.data[0].username,
        email: response.data[0].email,
        status: response.ok,
      }
      console.group("service api get use called")
      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
