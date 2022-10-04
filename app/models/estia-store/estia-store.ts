import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
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
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveEstias: (estiaSnapshots: EstiaSnapshotOut[]) => {
      self.estias.replace(estiaSnapshots)
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
    getEstiaById: (id: number) => {
      return self.estias.find((estia) => {
        return estia.id == id
      })
    },
  }))

export interface EstiaStore extends Instance<typeof EstiaStoreModel> {}
export interface EstiaStoreSnapshotOut extends SnapshotOut<typeof EstiaStoreModel> {}
export interface EstiaStoreSnapshotIn extends SnapshotIn<typeof EstiaStoreModel> {}
export const createCEstiaStoreDefaultModel = () => types.optional(EstiaStoreModel, {})
