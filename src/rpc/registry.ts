import CKB from '@nervosnetwork/ckb-sdk-core'
import { bytesToHex, serializeScript, blake160, addressToScript, scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { registryLockScript, secp256k1Dep } from '../account'
import { registerCompactNFT } from '../aggregator'
import { getCells, collectInputs, getLiveCell } from '../collector'
import { FEE, RegistryTypeScript, RegistryTypeDep, CompactNFTTypeScript, CompactNFTTypeDep } from '../constants/'
import { CKB_NODE_RPC, CLASS_PRIVATE_KEY, SENDER_ADDRESS } from '../utils/config'
import { append0x } from '../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)
const REGISTRY_CELL_CAPACITY = BigInt(150) * BigInt(100000000)
const COMPACT_NFT_CELL_CAPACITY = BigInt(200) * BigInt(100000000)

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

const generateCompactNFTOutputs = async (
  inputCapacity: bigint,
  compactNFTLocks: CKBComponents.Script[],
): Promise<CKBComponents.CellOutput[]> => {
  const registryLock = await registryLockScript()
  let outputs: CKBComponents.CellOutput[] = compactNFTLocks.map(lock => {
    const args = append0x(scriptToHash(lock))
    const compactNFTType = { ...CompactNFTTypeScript, args }
    return {
      capacity: `0x${COMPACT_NFT_CELL_CAPACITY.toString(16)}`,
      lock,
      type: compactNFTType,
    }
  })

  const compactNFTLength = BigInt(compactNFTLocks.length)
  const changeCapacity = inputCapacity - FEE - COMPACT_NFT_CELL_CAPACITY * compactNFTLength
  outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock: registryLock,
    type: null,
  })
  return outputs
}

export const createRegistryCell = async () => {
  const lock = await registryLockScript()
  const liveCells = await getCells(lock)
  const { inputs, capacity } = collectInputs(liveCells, REGISTRY_CELL_CAPACITY)
  const registryTypeArgs = bytesToHex(blake160(serializeScript(lock)))
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
  const signedTx = ckb.signTransaction(CLASS_PRIVATE_KEY)(rawTx)
  console.info(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Creating registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}

export const updateRegistryCell = async (registryOutPoint: CKBComponents.OutPoint, compactNFTAddresses: string[]) => {
  const compactNFTLocks = compactNFTAddresses.map(address => addressToScript(address))
  const compactNFTLength = BigInt(compactNFTLocks.length)

  const registryLock = await registryLockScript()
  const liveCells = await getCells(registryLock)
  const { inputs: normalInputs, capacity } = collectInputs(liveCells, COMPACT_NFT_CELL_CAPACITY * compactNFTLength)

  let inputs = [
    {
      previousOutput: registryOutPoint,
      since: '0x0',
    },
  ]
  inputs = inputs.concat(normalInputs)

  let outputs = await generateCompactNFTOutputs(capacity, compactNFTLocks)

  const registryCell = await getLiveCell(registryOutPoint)
  outputs = [registryCell.output].concat(outputs)
  outputs.at(-1).capacity = `0x${(BigInt(outputs.at(-1).capacity) - FEE).toString(16)}`

  const lockHashes = compactNFTLocks.map(lock => scriptToHash(lock))
  const [registryRootHash, witnessData] = await registerCompactNFT(lockHashes)
  const registryCellData = `0x00${registryRootHash}`

  const outputsData = outputs.map((_, i) => (i === 0 ? registryCellData : i !== outputs.length - 1 ? '0x00' : '0x'))

  const cellDeps = [await secp256k1Dep(), RegistryTypeDep, CompactNFTTypeDep]

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
    i > 0 ? '0x' : { lock: '', inputType: append0x(witnessData), outputType: '' },
  )
  const signedTx = ckb.signTransaction(CLASS_PRIVATE_KEY)(rawTx)
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}
