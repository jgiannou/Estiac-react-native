import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
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
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveUser: (userSnapshots: UserSnapshotOut) => {
      self.user = {
        id: String(userSnapshots.id),
        name: userSnapshots.name,
        username: userSnapshots.username,
        email: userSnapshots.email,
      }
    },
  }))
  .actions((self) => ({
    getUser: async (id: string) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getUser(id)
      if (result.kind === "ok") {
        self.saveUser(result.user)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
