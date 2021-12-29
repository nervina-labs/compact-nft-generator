import fetch from 'node-fetch'
import { COTA_AGGREGATOR_RPC } from '../utils/config'
import { toCamelcase, toSnakeCase } from '../utils/util'
import { ClaimReq, ClaimResp, DefineReq, DefineResp, MintReq, MintResp, SmtReq, SmtResp } from './types'

export const generateCotaSmt = async (method: string, req: SmtReq): Promise<SmtResp> => {
  console.log(JSON.stringify(toSnakeCase(req)))
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method,
    params: toSnakeCase(req),
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

export const generateDefineCotaSmt = async (define: DefineReq): Promise<DefineResp> => {
  return (await generateCotaSmt('generate_define_cota_smt', define)) as Promise<DefineResp>
}

export const generateMintCotaSmt = async (mint: MintReq): Promise<MintResp> => {
  return (await generateCotaSmt('generate_mint_cota_smt', mint)) as Promise<MintResp>
}

export const generateClaimCotaSmt = async (claim: ClaimReq): Promise<ClaimResp> => {
  return (await generateCotaSmt('generate_claim_cota_smt', claim)) as Promise<ClaimResp>
}
