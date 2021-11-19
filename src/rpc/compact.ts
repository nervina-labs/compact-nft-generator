import CKB from '@nervosnetwork/ckb-sdk-core'
import { secp256k1Dep } from '../account'
import { getLiveCell } from '../collector'
import { FEE, CompactNFTTypeDep } from '../constants'
import { CKB_NODE_RPC, COMPACT_NFT_PRIVATE_KEY } from '../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

export const claimCompactNFTFromMint = async (compactOutPoint: CKBComponents.OutPoint, mintOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: compactOutPoint,
      since: '0x0',
    },
  ]

  const compactNFTCell = await getLiveCell(compactOutPoint)
  const outputs = [compactNFTCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const outputsData = ["0x0050c2f4ee24063b2c8f2de60acedd5ad0f0cd0516104ffa268c28875b5757d2af"]
  const witnessData = "e10000001c0000003d0000004b00000084000000a8000000b300000001000000013939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002010000000505050505050505000001000000023939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002238bd41c4a735c4767640fa50b45fc9a951f892b0000000101000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff070000004c4fff4c4fff482a000000260000004c4ff950f6e4f07b5fd967f402d09cdb20e02d3acba1016f7c31666e51fa4005b8c9fb924f06"

  const mintCellDep: CKBComponents.CellDep = { outPoint: mintOutPoint, depType: 'code' }
  const cellDeps = [mintCellDep, await secp256k1Dep(), CompactNFTTypeDep]

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
    i > 0 ? '0x' : { lock: '', inputType: `0x01${witnessData}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(COMPACT_NFT_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim compact nft from mint tx has been sent with tx hash ${txHash}`)
  return txHash
}
