import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript, scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1Dep } from '../../account'
import { generateUpdateCotaSmt } from '../../aggregator/cota'
import { UpdateReq } from '../../aggregator/types'
import { getLiveCell } from '../../collector'
import { FEE, CotaTypeDep } from '../../constants'
import { CKB_NODE_RPC, RECEIVER_COTA_PRIVATE_KEY, RECEIVER_ADDRESS, BOB_ADDRESS, BOB_COTA_PRIVATE_KEY } from '../../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

export const updateCotaNFT = async (cotaOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: cotaOutPoint,
      since: '0x0',
    },
  ]
  const cotaCell = await getLiveCell(cotaOutPoint)
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`
  const updateReq: UpdateReq = {
    lockHash: scriptToHash(addressToScript(RECEIVER_ADDRESS)),
    nfts: [
      {
        cotaId: '0xe2195c905b0dbda99c590957fab4a042815c89c9',
        tokenIndex: '0x00000000',
        state: '0x00',
        characteristic: '0x2525250505050505050505050505050505050505',
      },
    ],
  }
  const { smtRootHash, updateSmtEntry } = await generateUpdateCotaSmt(updateReq)
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
    i > 0 ? '0x' : { lock: '', inputType: `0x05${updateSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(RECEIVER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update cota nft from mint tx has been sent with tx hash ${txHash}`)
}
