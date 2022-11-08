import { ApiResponse } from "apisauce"
import { Platform } from "react-native"
import { cos } from "react-native-reanimated"
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
  async uploadUserAvatar(file: string, userId: number): Promise<any> {
    try {
      const formData = new FormData()

      file != null &&
        formData.append("files", {
          name: "test.jpg",
          type: "image/jpeg",
          uri: Platform.OS === "ios" ? file.replace("file://", "") : file,
        })
      const response = await this.api.apisauce.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      if (response?.data[0].id != undefined) {
        const formData = new FormData()
        formData.append("refId", `${userId}`)
        formData.append("ref", "users")
        formData.append("field", "avatar")
        const data = JSON.stringify({
          avatar: response?.data[0].id,
        })

        return await this.api.apisauce.put(`/api/users/${userId}`, data)
      }
    } catch (e) {
      console.error(e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
