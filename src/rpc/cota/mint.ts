import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript, scriptToHash, serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateMintCotaSmt } from '../../aggregator/cota'
import { MintReq } from '../../aggregator/types'
import { getLiveCell } from '../../collector'
import { FEE, CotaTypeDep } from '../../constants'
import { CKB_NODE_RPC, SENDER_COTA_PRIVATE_KEY, SENDER_ADDRESS, RECEIVER_ADDRESS, ALICE_ADDRESS, BOB_ADDRESS } from '../../utils/config'
import { append0x } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

export const mintCotaNFT = async (cotaOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: cotaOutPoint,
      since: '0x0',
    },
  ]

  const cotaCell = await getLiveCell(cotaOutPoint)
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const mintReq: MintReq = {
    lockHash: scriptToHash(addressToScript(SENDER_ADDRESS)),
    cotaId: '0x2dd97617e685c0cd44b87cba7e8756ea67a721cd',
    outPoint: append0x(serializeOutPoint(cotaOutPoint).slice(26)),
    withdrawals: [
      {
        tokenIndex: '0x00000000',
        state: '0x00',
        characteristic: '0xa505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
      {
        tokenIndex: '0x00000001',
        state: '0x00',
        characteristic: '0xa505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(ALICE_ADDRESS)),
      },
      {
        tokenIndex: '0x00000002',
        state: '0x00',
        characteristic: '0xa505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(BOB_ADDRESS)),
      },
    ],
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
