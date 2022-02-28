import CKB from '@nervosnetwork/ckb-sdk-core'
import { scriptToHash, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
import { registerCotaCells } from '../../aggregator/registry'
import { getCells, collectInputs, getLiveCell } from '../../collector'
import { FEE, CotaTypeScript, CotaTypeDep, AlwaysSuccessLockScript, AlwaysSuccessLockDep } from '../../constants'
import { CKB_NODE_RPC } from '../../utils/config'
import { append0x, remove0x } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)
const COTA_CELL_CAPACITY = BigInt(160) * BigInt(100000000)

const generateCotaOutputs = async (
  inputCapacity: bigint,
  cotaLocks: CKBComponents.Script[],
): Promise<CKBComponents.CellOutput[]> => {
  const registryLock = AlwaysSuccessLockScript
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

export const updateRegistryCell = async (
  registryOutPoint: CKBComponents.OutPoint,
  cotaLocks: CKBComponents.Script[],
) => {
  const cotaCount = BigInt(cotaLocks.length)
  const registryLock = AlwaysSuccessLockScript
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

  const cellDeps = [AlwaysSuccessLockDep, CotaTypeDep]

  let rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : serializeWitnessArgs({ lock: '', inputType: append0x(registrySmtEntry), outputType: '' }),
  )
  console.log(JSON.stringify(rawTx))
  let txHash = await ckb.rpc.sendTransaction(rawTx, 'passthrough')
  console.info(`Update registry cell tx has been sent with tx hash ${txHash}`)
  return txHash
}
