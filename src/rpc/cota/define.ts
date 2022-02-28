import CKB from '@nervosnetwork/ckb-sdk-core'
import { hexToBytes, PERSONAL, scriptToHash, serializeInput } from '@nervosnetwork/ckb-sdk-utils'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import { secp256k1Dep } from '../../account'
import { generateDefineCotaSmt } from '../../aggregator/cota'
import { DefineReq } from '../../aggregator/types'
import { getCells, getLiveCell } from '../../collector'
import { FEE, CotaTypeDep, CotaTypeScript } from '../../constants'
import { CKB_NODE_RPC, SENDER_COTA_PRIVATE_KEY } from '../../utils/config'
import { u8ToHex } from '../../utils/hex'

const ckb = new CKB(CKB_NODE_RPC)

const generateCotaId = (firstInput: CKBComponents.CellInput, definesIndex: number) => {
  const input = hexToBytes(serializeInput(firstInput))
  const s = blake2b(32, null, null, PERSONAL)
  s.update(input)
  s.update(hexToBytes(`0x${u8ToHex(definesIndex)}`))
  return `0x${s.digest('hex').slice(0, 40)}`
}

export const defineCotaNFT = async (cotaLock: CKBComponents.Script) => {
  const cotaCells = await getCells(cotaLock, CotaTypeScript)
  if (!cotaCells || cotaCells.length === 0) {
    throw new Error("Cota cell doesn't exist")
  }
  const cotaCell = cotaCells[0]
  const inputs = [
    {
      previousOutput: cotaCell.outPoint,
      since: '0x0',
    },
  ]

  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  const cotaId = generateCotaId(inputs[0], 0)
  console.info(`cotaId:  ${cotaId}`)

  const defineReq: DefineReq = {
    lockHash: scriptToHash(cotaLock),
    cotaId,
    total: '0x00000132',
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
