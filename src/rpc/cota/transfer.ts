import CKB from '@nervosnetwork/ckb-sdk-core'
import { scriptToHash, serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateTransferCotaSmt } from '../../aggregator/cota'
import { TransferReq } from '../../aggregator/types'
import { getCells, getLiveCell } from '../../collector'
import { FEE, CotaTypeDep, CotaTypeScript } from '../../constants'
import {
  CKB_NODE_RPC,
  RECEIVER_COTA_PRIVATE_KEY,
} from '../../utils/config'
import { append0x } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

export const transferCotaNFT = async ({
  cotaLock,
  withdrawalLock,
  toLock,
}: {
  cotaLock: CKBComponents.Script
  withdrawalLock: CKBComponents.Script
  toLock: CKBComponents.Script
}) => {
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

  const cotaLockScript = serializeScript(cotaLock)
  const withdrawalLockHash = scriptToHash(withdrawalLock)
  const withdrawalCotaCells = await getCells(withdrawalLock, CotaTypeScript)
  if (!withdrawalCotaCells || withdrawalCotaCells.length === 0) {
    throw new Error("Withdrawal cota cell doesn't exist")
  }
  const withdrawalCotaCell = withdrawalCotaCells[0]

  const transferReq: TransferReq = {
    lockScript: cotaLockScript,
    withdrawalLockHash,
    transferOutPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
    transfers: [
      {
        cotaId: '0xb22585a8053af3fed0fd39127f5b1487ce08b756',
        tokenIndex: '0x00000001',
        toLockScript: serializeScript(toLock),
      },
    ],
  }
  const { smtRootHash, transferSmtEntry } = await generateTransferCotaSmt(transferReq)
  const outputsData = [`0x00${smtRootHash}`]

  const withdrawalCellDep: CKBComponents.CellDep = { outPoint: withdrawalCotaCell.outPoint, depType: 'code' }
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
    i > 0 ? '0x' : { lock: '', inputType: `0x06${transferSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(RECEIVER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Transfer cota nft from mint tx has been sent with tx hash ${txHash}`)
}
