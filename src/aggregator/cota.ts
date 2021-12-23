import fetch from 'node-fetch'
import { COTA_AGGREGATOR_RPC } from '../utils/config'
import { toCamelcase } from '../utils/util'

export interface DefineReq {
  lockHash: CKBComponents.Hash
  cotaId: Hex
  total: Hex
  issued: Hex
  configure: Hex
}

export interface DefineResp {
  smtRootHash: Hex
  defineSmtEntries: Hex
}

export const generateDefineCotaSmt = async (define: DefineReq): Promise<DefineResp> => {
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'generate_define_cota_smt',
    params: JSON.stringify(define),
  }
  const body = JSON.stringify(payload, null, '')
  try {
    let res = await fetch(COTA_AGGREGATOR_RPC, {
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
