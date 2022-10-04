import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { useState } from "react"
import { UserApi } from "../../services/api/user-api"
import { withEnvironment } from "../extensions/with-environment"
import { UserModel, UserSnapshotOut } from "../user/user"

/**
 * Example store Users
 */

export const UserStoreModel = types
  .model("UserStore")
  .props({
    user: types.optional(UserModel, {}),
    isAuth: Boolean(false),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveUser: (userSnapshots: UserSnapshotOut) => {
      self.user = {
        id: userSnapshots?.id,
        username: userSnapshots?.username,
        avatarSrc: userSnapshots?.avatarSrc,
        email: userSnapshots?.email,
        jwt: userSnapshots?.jwt,
        status: userSnapshots?.status,
      }
    },
  }))
  .actions((self) => ({
    resetUser: () => {
      console.log("reset")
      ;(self.user = {
        id: undefined,
        username: "",
        avatarSrc: "",
        email: "",
        jwt: "",
        status: false,
      }),
        (self.isAuth = false)
    },
  }))
  .actions((self) => ({
    getAuth: (value: boolean) => {
      self.isAuth = value
    },
  }))
  .actions((self) => ({
    getUser: async (password: string, email: string) => {
      self.resetUser()
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getUser(password, email)
      if (result.kind === "ok") {
        self.saveUser(result.user)
        self.getAuth(true)
      } else {
        console.log("error: getUser")
        self.saveUser(undefined)
        self.getAuth(false)
        __DEV__ && console.tron.log(result.kind)
      }
    },
    logoutUser: (value: boolean) => {
      const [logout, setlogout] = useState(false)

      setlogout(value)
      logout && self.saveUser(undefined)
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
