import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript, scriptToHash, serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateWithdrawalCotaSmt } from '../../aggregator/cota'
import { WithdrawalReq } from '../../aggregator/types'
import { getCells, getLiveCell } from '../../collector'
import { FEE, CotaTypeDep, CotaTypeScript } from '../../constants'
import {
  CKB_NODE_RPC,
  SENDER_ADDRESS,
  RECEIVER_ADDRESS,
  RECEIVER_COTA_PRIVATE_KEY,
  BOB_COTA_PRIVATE_KEY,
  ALICE_ADDRESS,
  BOB_ADDRESS,
  ALICE_COTA_PRIVATE_KEY,
  SENDER_COTA_PRIVATE_KEY,
} from '../../utils/config'
import { append0x, u32ToBe } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

const batchWithdrawals = new Array(80).fill(0).map((_, index) => {
  return {
    cotaId: '0xc7801a1d8ff707d2076b85de002160cf92ec7b65',
    tokenIndex: append0x(u32ToBe(index)),
    toLockScript: serializeScript(addressToScript(ALICE_ADDRESS)),
  }
})

const withdrawals = [
  {
    cotaId: '0xb22585a8053af3fed0fd39127f5b1487ce08b756',
    tokenIndex: '0x00000000',
    toLockScript: serializeScript(addressToScript(ALICE_ADDRESS)),
  },
]

export const withdrawCotaNFT = async (cotaLock: CKBComponents.Script) => {
  const cotaCells = await getCells(cotaLock, CotaTypeScript)
  if (!cotaCells || cotaCells.length === 0) {
    throw new Error("Cota cell doesn't exist")
  }
  const cotaCell = cotaCells[0]
  const inputs = [
    {
      previousOutput: cotaCell.outPoint,
      since: '0x0',
    },
  ]
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const withdrawalReq: WithdrawalReq = {
    lockHash: scriptToHash(cotaLock),
    outPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
    withdrawals,
  }
  const { smtRootHash, withdrawalSmtEntry } = await generateWithdrawalCotaSmt(withdrawalReq)
  const outputsData = [`0x00${smtRootHash}`]

  const cellDeps = [await secp256k1Dep(), CotaTypeDep]
  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `0x03${withdrawalSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(RECEIVER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Withdraw cota nft from mint tx has been sent with tx hash ${txHash}`)
  return txHash
}
