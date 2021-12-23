import { addressToScript, scriptToAddress, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { generateLockArgs } from './account'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { CKB_NODE_RPC } from './utils/config'
import { append0x } from './utils/hex'

const run = async () => {
  const lock = {
    codeHash: "0x614d40a86e1b29a8f4d8d93b9f3b390bf740803fa19a69f1c95716e029ea09b3",
    hashType: "type",
    args: "0x6EF3D502A52A4B1258C511DD9EF84D6FDBF5E9CAEADD55BA52A7BE7B76DDD17C",
  } as CKBComponents.Script
  const address = scriptToAddress(lock)
  console.log(address)
}

run()
