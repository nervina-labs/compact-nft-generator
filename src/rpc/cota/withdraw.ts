import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript, scriptToHash, serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateWithdrawalCotaSmt } from '../../aggregator/cota'
import { WithdrawalReq } from '../../aggregator/types'
import { getLiveCell } from '../../collector'
import { FEE, CotaTypeDep } from '../../constants'
import { CKB_NODE_RPC, SENDER_ADDRESS, RECEIVER_ADDRESS, RECEIVER_COTA_PRIVATE_KEY, BOB_COTA_PRIVATE_KEY, ALICE_ADDRESS, BOB_ADDRESS, ALICE_COTA_PRIVATE_KEY, SENDER_COTA_PRIVATE_KEY } from '../../utils/config'
import { append0x } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

export const withdrawCotaNFT = async (cotaOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: cotaOutPoint,
      since: '0x0',
    },
  ]
  const cotaCell = await getLiveCell(cotaOutPoint)
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`
  const toLockScript = addressToScript(ALICE_ADDRESS)
  const withdrawalReq: WithdrawalReq = {
    lockHash: scriptToHash(addressToScript(RECEIVER_ADDRESS)),
    outPoint: append0x(serializeOutPoint(cotaOutPoint).slice(26)),
    withdrawals: [
      {
        cotaId: '0x92e81156a629c73decd10d5dbf5e1ee6487ee47c',
        tokenIndex: '0x00000000',
        toLockScript: serializeScript(toLockScript),
      },
    ],
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
