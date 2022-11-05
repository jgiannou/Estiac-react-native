import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const EstiaModel = types.model("Estia").props({
  id: types.maybe(types.number),
  name: types.maybe(types.string),
  description: types.maybe(types.string),
  category: types.maybe(types.string),
  address: types.maybe(types.string),
  avatar: types.maybe(types.string),
  // photos: types.maybe(types.array(types.string)),
})

export interface Estia extends Instance<typeof EstiaModel> {}
export interface EstiaSnapshotOut extends SnapshotOut<typeof EstiaModel> {}
export interface EstiaSnapshotIn extends SnapshotIn<typeof EstiaModel> {}
export const createEstiaDefaultModel = () => types.optional(EstiaModel, {})
