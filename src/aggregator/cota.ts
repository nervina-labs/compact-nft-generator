import axios from 'axios'
import { COTA_AGGREGATOR_RPC } from '../utils/config'
import { toCamelcase, toSnakeCase } from '../utils/util'
import {
  ClaimReq,
  ClaimResp,
  DefineReq,
  DefineResp,
  MintReq,
  MintResp,
  SmtReq,
  SmtResp,
  TransferReq,
  TransferResp,
  UpdateReq,
  UpdateResp,
  WithdrawalReq,
  WithdrawalResp,
} from './types'

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
    let response = (
      await axios({
        method: 'post',
        url: COTA_AGGREGATOR_RPC,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 20000,
        data: body,
      })
    ).data
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

export const generateWithdrawalCotaSmt = async (withdrawal: WithdrawalReq): Promise<WithdrawalResp> => {
  return (await generateCotaSmt('generate_withdrawal_cota_smt', withdrawal)) as Promise<WithdrawalResp>
}

export const generateTransferCotaSmt = async (transfer: TransferReq): Promise<TransferResp> => {
  return (await generateCotaSmt('generate_transfer_cota_smt', transfer)) as Promise<TransferResp>
}

export const generateClaimCotaSmt = async (claim: ClaimReq): Promise<ClaimResp> => {
  return (await generateCotaSmt('generate_claim_cota_smt', claim)) as Promise<ClaimResp>
}

export const generateUpdateCotaSmt = async (update: UpdateReq): Promise<UpdateResp> => {
  return (await generateCotaSmt('generate_update_cota_smt', update)) as Promise<UpdateResp>
}

