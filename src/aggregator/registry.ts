import axios from 'axios'
import { REGISTRY_AGGREGATOR_RPC } from '../utils/config'
import { toCamelcase } from '../utils/util'

export interface RegistryResp {
  smtRootHash: Hex
  registrySmtEntry: Hex
}

export const registerCotaCells = async (lockHashes: CKBComponents.Hash[]): Promise<RegistryResp> => {
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'register_cota_cells',
    params: lockHashes,
  }
  const body = JSON.stringify(payload, null, '')
  try {
    let response = (await axios({
      method: 'post',
      url: REGISTRY_AGGREGATOR_RPC,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      data: body
    })).data
    if (response.error) {
      console.error(response)
    } else {
      console.log(JSON.stringify(response))
      return toCamelcase(response.result)
    }
  } catch (error) {
    console.error('error', error)
  }
}
