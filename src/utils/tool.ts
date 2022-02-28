import { addressToScript, scriptToAddress, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { CKB_NODE_RPC, RECEIVER_ADDRESS, SENDER_ADDRESS } from '../utils/config'
import { AlwaysSuccessLockScript } from '../constants'

const parseScript = async () => {
  console.log(scriptToAddress(AlwaysSuccessLockScript))
}

parseScript()
