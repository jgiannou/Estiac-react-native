import { ApiResponse } from "apisauce"
import { estiaMapper } from "../../utils/mappers"
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"

export class EstiaApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getEstias(): Promise<any> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/api/estias?populate=*`)
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const estias = response?.data?.data?.map(estiaMapper)
      return { kind: "ok", estias }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getEstiaById(estiaId: number): Promise<any> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/api/estias/${estiaId}?populate=*`,
      )
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const estia = estiaMapper(response?.data?.data)
      return { kind: "ok", estia }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
