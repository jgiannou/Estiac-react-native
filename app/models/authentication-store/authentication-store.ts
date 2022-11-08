import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { AsyncStorage } from "react-native"
import { LoginResult, LogoutResult } from "../../services/api"
import { AuthenticationApi } from "../../services/api/authentication-api"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"

/**
 * Model description here for TypeScript hints.
 */
export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    id: types.optional(types.number, -1),
    isAuthenticationed: types.optional(types.boolean, false),
    jwt: types.optional(types.string, ""),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => ({
    setAuthenticated(value: boolean, jwt: string, id: number) {
      self.id = id
      self.isAuthenticationed = value
      self.jwt = jwt
    },
  }))
  .actions((self) => ({
    register: flow(function* (username: string, email: string, password: string) {
      self.setStatus("pending")
      self.setStatus("pending")
      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: LoginResult = yield authenticationApi.register(username, email, password)

      if (result.kind === "ok") {
        self.setStatus("done")
        self.setAuthenticated(true, result.jwt, result.id)
      } else {
        self.setStatus("error")
        self.setAuthenticated(false, "", undefined)
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    login: flow(function* (emailAddress: string, password: string) {
      self.setStatus("pending")

      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: LoginResult = yield authenticationApi.login(emailAddress, password)

      if (result.kind === "ok") {
        self.setStatus("done")
        self.setAuthenticated(true, result.jwt, result.id)
      } else {
        self.setStatus("error")
        self.setAuthenticated(false, "", undefined)
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    logout: flow(function* () {
      self.setStatus("pending")

      self.setStatus("done")
      self.setAuthenticated(false, "", undefined)
    }),
  }))

type AuthenticationStoreType = Instance<typeof AuthenticationStoreModel>
export interface AuthenticationStore extends AuthenticationStoreType {}
type AuthenticationStoreSnapshotType = SnapshotOut<typeof AuthenticationStoreModel>
export interface AuthenticationStoreSnapshot extends AuthenticationStoreSnapshotType {}
export const createAuthenticationStoreDefaultModel = () =>
  types.optional(AuthenticationStoreModel, {})
