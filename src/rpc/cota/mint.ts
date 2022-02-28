import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript, scriptToHash, serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateMintCotaSmt } from '../../aggregator/cota'
import { MintReq } from '../../aggregator/types'
import { getCells } from '../../collector'
import { FEE, CotaTypeDep, CotaTypeScript } from '../../constants'
import { CKB_NODE_RPC, SENDER_COTA_PRIVATE_KEY, RECEIVER_ADDRESS, ALICE_ADDRESS } from '../../utils/config'
import { append0x, u32ToBe } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

const batchWithdrawals = new Array(20).fill(0).map((_, index) => {
  return {
    tokenIndex: append0x(u32ToBe(index)),
    state: '0x00',
    characteristic: '0xa505050505050505050505050505050505050505',
    toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
  }
})

const withdrawals = [
  {
    tokenIndex: '0x00000000',
    state: '0x00',
    characteristic: '0x0505050505050505050505050505050505050505',
    toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
  },
  {
    tokenIndex: '0x00000001',
    state: '0x00',
    characteristic: '0x0505050505050505050505050505050505050505',
    toLockScript: serializeScript(addressToScript(ALICE_ADDRESS)),
  },
]

export const mintCotaNFT = async (cotaLock: CKBComponents.Script) => {
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

  const mintReq: MintReq = {
    lockHash: scriptToHash(cotaLock),
    cotaId: '0x935c4d7a609475578fe3ddba1b817637f8be4c71',
    outPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
    withdrawals: withdrawals,
  }

  const { smtRootHash, mintSmtEntry } = await generateMintCotaSmt(mintReq)
  const cotaCellData = `0x00${smtRootHash}`

  const outputsData = [cotaCellData]
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
    i > 0 ? '0x' : { lock: '', inputType: `0x02${mintSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(SENDER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
}
