import { serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import fetch from 'node-fetch'
import { REGISTRY_AGGREGATOR_RPC } from '../utils/config'
import { toCamelcase } from '../utils/util'

export const registerCompactNFT = async (lock: CKBComponents.Script): Promise<string> => {
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'register_compact_nft',
    params: [serializeScript(lock)],
  }
  const body = JSON.stringify(payload, null, '  ')
  try {
    let res = await fetch(REGISTRY_AGGREGATOR_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    const response = await res.json()
    return toCamelcase(response.result)
  } catch (error) {
    console.error('error', error)
  }
}

