import CKB from '@nervosnetwork/ckb-sdk-core'
import {
  addressToScript,
  scriptToHash,
} from '@nervosnetwork/ckb-sdk-utils'
import { registryLockScript, secp256k1Dep } from '../../account'
import { registerCotaCells } from '../../aggregator/registry'
import { getCells, collectInputs, getLiveCell } from '../../collector'
import { FEE, RegistryTypeDep, CotaTypeScript, CotaTypeDep } from '../../constants'
import { CKB_NODE_RPC, REGISTRY_PRIVATE_KEY } from '../../utils/config'
import { append0x, remove0x } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)
const COTA_CELL_CAPACITY = BigInt(200) * BigInt(100000000)

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
  const { smtRootHash, registrySmtEntry } = await registerCotaCells(lockHashes)
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
    i > 0 ? '0x' : { lock: '', inputType: append0x(registrySmtEntry), outputType: '' },
  )
  const signedTx = ckb.signTransaction(REGISTRY_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}
