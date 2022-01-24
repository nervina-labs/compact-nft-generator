import { scriptToAddress, scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { CKB_NODE_RPC } from '../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

const parseScript = async () => {
  const type = {
    codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
    hashType: 'type',
    args: '0x9abd4d12620abeef1bac3bcf8e328cdb8d1d7fb8320bb2ee01d62250868794b0',
  } as CKBComponents.Script
  console.log(scriptToHash(type))
}

parseScript()
