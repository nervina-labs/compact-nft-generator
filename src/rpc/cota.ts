import CKB from '@nervosnetwork/ckb-sdk-core'
import {
  addressToScript,
  hexToBytes,
  PERSONAL,
  scriptToHash,
  serializeInput,
  serializeOutPoint,
  serializeScript,
} from '@nervosnetwork/ckb-sdk-utils'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import { secp256k1Dep } from '../account'
import { generateClaimCotaSmt, generateDefineCotaSmt, generateMintCotaSmt, generateUpdateCotaSmt, generateWithdrawalCotaSmt } from '../aggregator/cota'
import { ClaimReq, DefineReq, MintReq, MintResp, UpdateReq, WithdrawalReq } from '../aggregator/types'
import { getLiveCell } from '../collector'
import { FEE, CotaTypeDep } from '../constants'
import {
  CKB_NODE_RPC,
  SENDER_COTA_PRIVATE_KEY,
  RECEIVER_COTA_PRIVATE_KEY,
  SENDER_ADDRESS,
  RECEIVER_ADDRESS,
} from '../utils/config'
import { append0x, u8ToHex } from '../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

const generateCotaId = (firstInput: CKBComponents.CellInput, definesIndex: number) => {
  const input = hexToBytes(serializeInput(firstInput))
  const s = blake2b(32, null, null, PERSONAL)
  s.update(input)
  s.update(hexToBytes(`0x${u8ToHex(definesIndex)}`))
  return `0x${s.digest('hex').slice(0, 40)}`
}

export const defineCotaNFT = async (cotaOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: cotaOutPoint,
      since: '0x0',
    },
  ]

  const cotaCell = await getLiveCell(cotaOutPoint)
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const defineReq: DefineReq = {
    lockHash: scriptToHash(addressToScript(SENDER_ADDRESS)),
    cotaId: generateCotaId(inputs[0], 0),
    total: '0x00000064',
    issued: '0x00000000',
    configure: '0x00',
  }

  const { smtRootHash, defineSmtEntry } = await generateDefineCotaSmt(defineReq)
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
    i > 0 ? '0x' : { lock: '', inputType: `0x01${defineSmtEntry}`, outputType: '' },
  )
  const signedTx = ckb.signTransaction(SENDER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Define cota nft tx has been sent with tx hash ${txHash}`)
}

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

  const toLockScript = addressToScript(RECEIVER_ADDRESS)

  const mintReq: MintReq = {
    lockHash: scriptToHash(addressToScript(SENDER_ADDRESS)),
    cotaId: '0x2c46b3babebf35ddb6f1ce7b0da79ada5945e9e5',
    outPoint: append0x(serializeOutPoint(cotaOutPoint).slice(26)),
    withdrawals: [
      {
        tokenIndex: '0x00000000',
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(toLockScript),
      },
      {
        tokenIndex: '0x00000001',
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(toLockScript),
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
  const toLockScript = addressToScript(RECEIVER_ADDRESS)
  const withdrawalReq: WithdrawalReq = {
    lockHash: scriptToHash(addressToScript(SENDER_ADDRESS)),
    outPoint: append0x(serializeOutPoint(cotaOutPoint).slice(26)),
    withdrawals: [
      {
        cotaId: '0x2c46b3babebf35ddb6f1ce7b0da79ada5945e9e5',
        tokenIndex: '0x00000000',
        toLockScript: serializeScript(toLockScript),
      },
    ],
  }
  const {smtRootHash, withdrawalSmtEntry} = await generateWithdrawalCotaSmt(withdrawalReq)
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
  const signedTx = ckb.signTransaction(SENDER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Withdraw cota nft from mint tx has been sent with tx hash ${txHash}`)
  return txHash
}

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
    lockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
    withdrawal_lock_hash: scriptToHash(addressToScript(SENDER_ADDRESS)),
    claims: [
      {
        cotaId: '0x2c46b3babebf35ddb6f1ce7b0da79ada5945e9e5',
        tokenIndex: '0x00000000',
      },
      {
        cotaId: '0x2c46b3babebf35ddb6f1ce7b0da79ada5945e9e5',
        tokenIndex: '0x00000001',
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
  const signedTx = ckb.signTransaction(RECEIVER_COTA_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim cota nft from mint tx has been sent with tx hash ${txHash}`)
}


export const UpdateCotaNFT = async (
  cotaOutPoint: CKBComponents.OutPoint,
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

  const updateReq: UpdateReq = {
    lockHash: scriptToHash(addressToScript(RECEIVER_ADDRESS)),
    nfts: [
      {
        cotaId: '0x2c46b3babebf35ddb6f1ce7b0da79ada5945e9e5',
        tokenIndex: '0x00000001',
        state: "0x00",
        characteristic: "0xa5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5"
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
