import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateClaimCotaSmt } from '../../aggregator/cota'
import { ClaimReq } from '../../aggregator/types'
import { getLiveCell } from '../../collector'
import { FEE, CotaTypeDep } from '../../constants'
import { CKB_NODE_RPC, RECEIVER_COTA_PRIVATE_KEY, SENDER_ADDRESS, RECEIVER_ADDRESS, SENDER_COTA_PRIVATE_KEY, BOB_ADDRESS, BOB_COTA_PRIVATE_KEY, ALICE_COTA_PRIVATE_KEY } from '../../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

export const claimCotaNFT = async (
  cotaOutPoint: CKBComponents.OutPoint,
  withdrawalOutPoint: CKBComponents.OutPoint,
) => {
  const inputs = [
    {
      previousOutput: cotaOutPoint,
      since: '0x0',
    },
  ]

  const cotaCell = await getLiveCell(cotaOutPoint)
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const claimReq: ClaimReq = {
    lockScript: serializeScript(addressToScript(BOB_ADDRESS)),
    withdrawal_lock_hash: scriptToHash(addressToScript(BOB_ADDRESS)),
    claims: [
      {
        cotaId: '0x0629952fd6c6c12aff40d77f16d3e8d060d0608c',
        tokenIndex: '0x00000002',
      },
    ],
  }

  const { smtRootHash, claimSmtEntry } = await generateClaimCotaSmt(claimReq)
  const outputsData = [`0x00${smtRootHash}`]

  const withdrawalCellDep: CKBComponents.CellDep = { outPoint: withdrawalOutPoint, depType: 'code' }
  const cellDeps = [withdrawalCellDep, await secp256k1Dep(), CotaTypeDep]

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
    i > 0 ? '0x' : { lock: '', inputType: `0x04${claimSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(ALICE_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim cota nft from mint tx has been sent with tx hash ${txHash}`)
}
