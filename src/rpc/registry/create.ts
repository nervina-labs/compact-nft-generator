import CKB from '@nervosnetwork/ckb-sdk-core'
import {
  hexToBytes,
  serializeInput,
  PERSONAL,
} from '@nervosnetwork/ckb-sdk-utils'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import { registryLockScript, secp256k1Dep } from '../../account'
import { getCells, collectInputs } from '../../collector'
import { FEE, RegistryTypeScript, CotaTypeDep, MIN_CAPACITY } from '../../constants'
import { CKB_NODE_RPC, REGISTRY_PRIVATE_KEY } from '../../utils/config'
import { u64ToLe } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)
const REGISTRY_CELL_CAPACITY = BigInt(150) * BigInt(100000000)

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
  const { inputs, capacity } = collectInputs(liveCells, REGISTRY_CELL_CAPACITY + MIN_CAPACITY)
  const registryTypeArgs = generateRegistryTypeArgs(inputs[0], BigInt(0))
  console.info(`registry type args: ${registryTypeArgs}`)
  const outputs = await generateRegistryOutputs(capacity, { ...RegistryTypeScript, args: registryTypeArgs })
  const cellDeps = [await secp256k1Dep(), CotaTypeDep]
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
