import CKB from '@nervosnetwork/ckb-sdk-core'
import { secp256k1Dep } from '../account'
import { getLiveCell } from '../collector'
import { FEE, CotaTypeDep } from '../constants'
import { CKB_NODE_RPC, COMPACT_NFT_PRIVATE_KEY, RECEIVER_COMPACT_NFT_PRIVATE_KEY } from '../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

export const claimCompactNFTFromMint = async (
  compactOutPoint: CKBComponents.OutPoint,
  mintOutPoint: CKBComponents.OutPoint,
) => {
  const inputs = [
    {
      previousOutput: compactOutPoint,
      since: '0x0',
    },
  ]

  const compactNFTCell = await getLiveCell(compactOutPoint)
  const outputs = [compactNFTCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const outputsData = ['0x00d897329104af03433c8f12439da4bc989a58da9837105fb13754998470258221']
  const witnessData =
    'dd0000001c0000003d0000004b00000084000000a8000000b300000001000000013939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002010000000505050505050505000001000000023939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002238bd41c4a735c4767640fa50b45fc9a951f892b0100000001000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff070000004c4fff4c4fff48260000004c4ff950f6e4f07b5fd967f402d09cdb20e02d3acba1016f7c31666e51fa4005b8c9fb924f06'

  const mintCellDep: CKBComponents.CellDep = { outPoint: mintOutPoint, depType: 'code' }
  const cellDeps = [mintCellDep, await secp256k1Dep(), CotaTypeDep]

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

export const withdrawCompactNFT = async (compactOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: compactOutPoint,
      since: '0x0',
    },
  ]

  const compactNFTCell = await getLiveCell(compactOutPoint)
  const outputs = [compactNFTCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const outputsData = ['0x00681201c0682ee298bf5dd91777f951cd5aa3d8619724f92fccf7fabcb9b49ccf']
  const witnessData =
    'f100000018000000390000004700000068000000a200000001000000013939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002010000000505050505050505000001000000023939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002010000000505050505050505000066abc04e590ca014a7433cb21f2a079a7ba18335a32cd26079d351ae8953d511bd322544fc2ba94a000000004b0000004c4f194c4f19484fe551ff0c8f4a64e8ecad6b62806799a0ff51b449a69afb6bed0a10c93d746da54a4fb4cb8d04b805790429388958cf4c3f60caddae39b57014805172e97236c92a2762'

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
    i > 0 ? '0x' : { lock: '', inputType: `0x02${witnessData}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(COMPACT_NFT_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim compact nft from mint tx has been sent with tx hash ${txHash}`)
  return txHash
}

export const claimCompactNFT = async (
  compactOutPoint: CKBComponents.OutPoint,
  withdrawalOutPoint: CKBComponents.OutPoint,
) => {
  const inputs = [
    {
      previousOutput: compactOutPoint,
      since: '0x0',
    },
  ]

  const compactNFTCell = await getLiveCell(compactOutPoint)
  const outputs = [compactNFTCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const outputsData = ['0x00c588ac49286d3de8f738e4c4d61669078ff8ed617fe86d201022a5df4dfc46cb']
  const witnessData =
    '020100001c0000003d0000004b00000084000000a8000000b300000001000000013939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002010000000505050505050505000001000000033939ecec56db8161b6308c84d6f5f9f12d00d1f00000000300000002a32cd26079d351ae8953d511bd322544fc2ba94a0000000001000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff070000004c4fff4c4fff484b0000004c4f194c4f19484fe551ff0c8f4a64e8ecad6b62806799a0ff51b449a69afb6bed0a10c93d746da54a4fb4cb8d04b805790429388958cf4c3f60caddae39b57014805172e97236c92a2762'

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
    i > 0 ? '0x' : { lock: '', inputType: `0x03${witnessData}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(RECEIVER_COMPACT_NFT_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim compact nft from mint tx has been sent with tx hash ${txHash}`)
  return txHash
}
