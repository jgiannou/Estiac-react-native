import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "../authentication-store/authentication-store"
import { CharacterStoreModel } from "../character-store/character-store"
import { EstiaStoreModel } from "../estia-store/estia-store"
import { UserStoreModel } from "../user-store/user-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  userStore: types.optional(UserStoreModel, {} as any),
  estiaStore:  types.optional(EstiaStoreModel, {} as any),
  authenticationStore: types.optional(AuthenticationStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
