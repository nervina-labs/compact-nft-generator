import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { CKB_NODE_RPC, SENDER_ADDRESS, RECEIVER_ADDRESS, REGISTRY_PRIVATE_KEY } from '../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

export const registryLockScript = async (): Promise<CKBComponents.Script> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return {
    codeHash: secp256k1Dep.codeHash,
    hashType: secp256k1Dep.hashType,
    args: generateLockArgs(REGISTRY_PRIVATE_KEY),
  }
}

export const senderLockScript = (): CKBComponents.Script => {
  return addressToScript(SENDER_ADDRESS)
}

export const receiverLockScript = (): CKBComponents.Script => {
  return addressToScript(RECEIVER_ADDRESS)
}

export const generateLockArgs = (privateKey: Hex) => {
  const pubKey = ckb.utils.privateKeyToPublicKey(privateKey)
  return '0x' + ckb.utils.blake160(pubKey, 'hex')
}

export const secp256k1Dep = async (): Promise<CKBComponents.CellDep> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return { outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }
}
