import CKB from '@nervosnetwork/ckb-sdk-core'
import {
  bytesToHex,
  serializeScript,
  blake160,
  addressToScript,
  scriptToHash,
  hexToBytes,
  serializeInput,
  PERSONAL,
} from '@nervosnetwork/ckb-sdk-utils'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import { registryLockScript, secp256k1Dep } from '../account'
import { registerCotaCells } from '../aggregator/registry'
import { getCells, collectInputs, getLiveCell } from '../collector'
import { FEE, RegistryTypeScript, RegistryTypeDep, CotaTypeScript, CotaTypeDep } from '../constants/'
import { CKB_NODE_RPC, REGISTRY_PRIVATE_KEY } from '../utils/config'
import { append0x, remove0x, u64ToLe } from '../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)
const REGISTRY_CELL_CAPACITY = BigInt(150) * BigInt(100000000)
const COTA_CELL_CAPACITY = BigInt(200) * BigInt(100000000)

const generateRegistryOutputs = async (
  inputCapacity: bigint,
  registryType: CKBComponents.Script,
): Promise<CKBComponents.CellOutput[]> => {
  const lock = await registryLockScript()
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

const generateCotaOutputs = async (
  inputCapacity: bigint,
  cotaLocks: CKBComponents.Script[],
): Promise<CKBComponents.CellOutput[]> => {
  const registryLock = await registryLockScript()
  let outputs: CKBComponents.CellOutput[] = cotaLocks.map(lock => {
    const args = append0x(remove0x(scriptToHash(lock)).slice(0, 40))
    const cotaType = { ...CotaTypeScript, args }
    return {
      capacity: `0x${COTA_CELL_CAPACITY.toString(16)}`,
      lock,
      type: cotaType,
    }
  })

  const cotaCellsLength = BigInt(cotaLocks.length)
  const changeCapacity = inputCapacity - FEE - COTA_CELL_CAPACITY * cotaCellsLength
  outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock: registryLock,
    type: null,
  })
  return outputs
}

const generateRegistryTypeArgs = (firstInput: CKBComponents.CellInput, firstOutputIndex: bigint) => {
  const input = hexToBytes(serializeInput(firstInput))
  const s = blake2b(32, null, null, PERSONAL)
  s.update(input)
  s.update(hexToBytes(`0x${u64ToLe(firstOutputIndex)}`))
  return `0x${s.digest('hex').slice(0, 40)}`
}

export const createRegistryCell = async () => {
  const lock = await registryLockScript()
  const liveCells = await getCells(lock)
  const { inputs, capacity } = collectInputs(liveCells, REGISTRY_CELL_CAPACITY)
  const registryTypeArgs = generateRegistryTypeArgs(inputs[0], BigInt(0))
  const outputs = await generateRegistryOutputs(capacity, { ...RegistryTypeScript, args: registryTypeArgs })
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
  const signedTx = ckb.signTransaction(REGISTRY_PRIVATE_KEY)(rawTx)
  console.info(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Creating registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}

export const updateRegistryCell = async (registryOutPoint: CKBComponents.OutPoint, cotaAddresses: string[]) => {
  const cotaLocks = cotaAddresses.map(address => addressToScript(address))
  const cotaCount = BigInt(cotaLocks.length)

  const registryLock = await registryLockScript()
  const liveCells = await getCells(registryLock)
  const { inputs: normalInputs, capacity } = collectInputs(liveCells, COTA_CELL_CAPACITY * cotaCount)

  let inputs = [
    {
      previousOutput: registryOutPoint,
      since: '0x0',
    },
  ]
  inputs = inputs.concat(normalInputs)

  let outputs = await generateCotaOutputs(capacity, cotaLocks)

  const registryCell = await getLiveCell(registryOutPoint)
  outputs = [registryCell.output].concat(outputs)
  outputs.at(-1).capacity = `0x${(BigInt(outputs.at(-1).capacity) - FEE).toString(16)}`

  const lockHashes = cotaLocks.map(lock => scriptToHash(lock))
  const { smtRootHash, registrySmtEntries } = await registerCotaCells(lockHashes)
  const registryCellData = `0x00${smtRootHash}`

  const outputsData = outputs.map((_, i) => (i === 0 ? registryCellData : i !== outputs.length - 1 ? '0x00' : '0x'))

  const cellDeps = [await secp256k1Dep(), RegistryTypeDep, CotaTypeDep]

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
    i > 0 ? '0x' : { lock: '', inputType: append0x(registrySmtEntries), outputType: '' },
  )
  const signedTx = ckb.signTransaction(REGISTRY_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}
