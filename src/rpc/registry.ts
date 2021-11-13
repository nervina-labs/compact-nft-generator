import CKB from '@nervosnetwork/ckb-sdk-core'
import { bytesToHex, serializeScript, blake160 } from '@nervosnetwork/ckb-sdk-utils'
import { classLockScript, secp256k1Dep, alwaysSuccessLock, alwaysSuccessCellDep } from '../account'
import { getCells, collectInputs, getLiveCell } from '../collector'
import { FEE, RegistryTypeScript, RegistryTypeDep } from '../constants/'
import { CKB_NODE_RPC, CLASS_PRIVATE_KEY } from '../utils/config'
import { u64ToLe } from '../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)
const REGISTRY_CELL_CAPACITY = BigInt(150) * BigInt(100000000)
const PERSONAL = new Uint8Array([99, 107, 98, 45, 100, 101, 102, 97, 117, 108, 116, 45, 104, 97, 115, 104])


const generateRegistryOutputs = async (
  inputCapacity: bigint,
  registryType: CKBComponents.Script,
) => {
  const lock = await classLockScript()
  let outputs: CKBComponents.CellOutput[] = [
    {
      capacity: `0x${REGISTRY_CELL_CAPACITY.toString(16)}`,
      lock,
      type: registryType,
    },
  ]
  const changeCapacity = inputCapacity - FEE - REGISTRY_CELL_CAPACITY
  outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock,
  })
  return outputs
}

export const createRegistryCell = async () => {
  const lock = await classLockScript()
  const liveCells = await getCells(lock)
  const { inputs, capacity } = collectInputs(liveCells, REGISTRY_CELL_CAPACITY)
  const registryTypeArgs = bytesToHex(blake160(serializeScript(lock)))
  const outputs = await generateRegistryOutputs(
    capacity,
    { ...RegistryTypeScript, args: registryTypeArgs },
  )
  const cellDeps = [await secp256k1Dep(), RegistryTypeDep]
  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData: ['0x00', '0x'],
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(CLASS_PRIVATE_KEY)(rawTx)
  console.info(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Creating registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}


export const updateIssuerCell = async (registryOutPoint: CKBComponents.OutPoint) => {
  const inputs = [
    {
      previousOutput: registryOutPoint,
      since: '0x0',
    },
  ]

  const issuerCell = await getLiveCell(registryOutPoint)
  const outputs = [issuerCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  let outputsData = ['0x00']

  const cellDeps = [await secp256k1Dep(), RegistryTypeDep]

  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(CLASS_PRIVATE_KEY)(rawTx)
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update issuer cell tx has been sent with tx hash ${txHash}`)
  return txHash
}