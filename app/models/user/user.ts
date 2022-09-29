import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * User model.
 */
export const UserModel = types.model("User").props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  username: types.maybe(types.string),
  email: types.maybe(types.string),
})

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
