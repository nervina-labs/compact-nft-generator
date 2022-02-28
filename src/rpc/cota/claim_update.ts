import CKB from '@nervosnetwork/ckb-sdk-core'
import { scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateClaimUpdateCotaSmt } from '../../aggregator/cota'
import { ClaimUpdateReq } from '../../aggregator/types'
import { getCells } from '../../collector'
import { FEE, CotaTypeDep, CotaTypeScript } from '../../constants'
import { CKB_NODE_RPC, RECEIVER_COTA_PRIVATE_KEY } from '../../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

const nfts = [
  {
    cotaId: '0x935c4d7a609475578fe3ddba1b817637f8be4c71',
    tokenIndex: '0x00000000',
    state: '0x00',
    characteristic: '0x2525250505050505050505050505050505050505',
  },
]

export const claimUpdateCotaNFT = async (cotaLock: CKBComponents.Script, withdrawalLock: CKBComponents.Script) => {
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

  const withdrawalLockHash = scriptToHash(withdrawalLock)
  const withdrawalCotaCells = await getCells(withdrawalLock, CotaTypeScript)
  if (!withdrawalCotaCells || withdrawalCotaCells.length === 0) {
    throw new Error("Withdrawal cota cell doesn't exist")
  }
  const withdrawalCotaCell = withdrawalCotaCells[0]

  const claimUpdateReq: ClaimUpdateReq = {
    lockScript: serializeScript(cotaLock),
    withdrawalLockHash,
    nfts,
  }

  const { smtRootHash, claimUpdateSmtEntry } = await generateClaimUpdateCotaSmt(claimUpdateReq)
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
    i > 0 ? '0x' : { lock: '', inputType: `0x07${claimUpdateSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(RECEIVER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim and update cota nft from mint tx has been sent with tx hash ${txHash}`)
}
