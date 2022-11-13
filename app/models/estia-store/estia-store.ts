import { Instance, SnapshotIn, SnapshotOut, types, cast } from "mobx-state-tree"
import { EstiaModel, EstiaSnapshotOut } from "../estia/estia"
import { EstiaApi } from "../../services/api/estia-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing Rick and Morty characters
 */
export const EstiaStoreModel = types
  .model("EstiaStore")
  .props({
    estias: types.optional(types.array(EstiaModel), []),
    estia: types.optional(EstiaModel, {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveEstias: (estiaSnapshots: EstiaSnapshotOut[]) => {
      self.estias = cast(estiaSnapshots)
    },
    saveEstia: (estiaSnapshot: EstiaSnapshotOut) => {
      // self.estia = {
      //   id: estiaSnapshot?.id,
      //   name: estiaSnapshot?.name,
      //   description: estiaSnapshot?.description,
      //   category: estiaSnapshot?.category,
      //   address: estiaSnapshot?.address,
      //   avatar: estiaSnapshot?.avatar,
      //   photos: estiaSnapshot?.photos?.map((item) => item.url),
      // }
      self.estia = cast(estiaSnapshot)
    },
  }))
  .actions((self) => ({
    resetEstia: () => {
      self.estia = {
        id: undefined,
        name: "",
        description: "",
        category: "",
        address: "",
        avatar: "",
        photos: undefined,
        price: undefined,
        cover: "",
      }
    },
  }))
  .actions((self) => ({
    getEstias: async () => {
      const estiaApi = new EstiaApi(self.environment.api)
      const result = await estiaApi.getEstias()
      if (result.kind === "ok") {
        self.saveEstias(result.estias)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))
  .actions((self) => ({
    getEstiaById: async (id: number) => {
      self.resetEstia()
      const estiaApi = new EstiaApi(self.environment.api)
      const result = await estiaApi.getEstiaById(id)
      if (result.kind === "ok") {
        self.saveEstia(result.estia)
      } else {
        console.log("error: getEstia")
        self.saveEstia(undefined)
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

export interface EstiaStore extends Instance<typeof EstiaStoreModel> {}
export interface EstiaStoreSnapshotOut extends SnapshotOut<typeof EstiaStoreModel> {}
export interface EstiaStoreSnapshotIn extends SnapshotIn<typeof EstiaStoreModel> {}
export const createCEstiaStoreDefaultModel = () => types.optional(EstiaStoreModel, {})
