import { IDModel } from "../models/iModel"
import { DEFAULT_API_CONFIG } from "../services/api/api-config"

export const estiaMapper = (data: IDModel) => ({
  id: data?.id,
  name: data?.attributes?.name,
  description: data?.attributes?.description,
  category: data?.attributes?.category,
  address: data?.attributes?.address,
  avatar:
    DEFAULT_API_CONFIG.url + data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url,
})
