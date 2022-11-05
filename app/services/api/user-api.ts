import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { DEFAULT_API_CONFIG } from "./api-config"
import { getGeneralApiProblem } from "./api-problem"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getUserById(id: number): Promise<any> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/api/users/${id}?populate=*`)
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const user = {
        id: response?.data?.id,
        username: response?.data?.username,
        email: response?.data?.email,
        avatarSrc: DEFAULT_API_CONFIG.url + response?.data?.avatar?.url,
        status: response?.ok,
      }
      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
