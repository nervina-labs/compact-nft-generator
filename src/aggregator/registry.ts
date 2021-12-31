import fetch from 'node-fetch'
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
    let res = await fetch(REGISTRY_AGGREGATOR_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    const response = await res.json()
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
