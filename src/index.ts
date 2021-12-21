import { addressToScript, scriptToAddress, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { generateLockArgs } from './account'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { CKB_NODE_RPC } from './utils/config'
import { append0x } from './utils/hex'

const run = async () => {
  const ckb = new CKB(CKB_NODE_RPC)
  const lockArgs = await generateLockArgs(append0x("cdecc6bc9858fa707330c606ef47e605be859d26708c7b25f0875cbc1f0896ce"))
  const dep = (await ckb.loadDeps()).secp256k1Dep
  const lock = {
    codeHash: dep.codeHash,
    hashType: dep.hashType,
    args: lockArgs,
  }
  const address = scriptToAddress(lock, false)
  console.log(address)
}

run()
