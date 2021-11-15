import CKB from '@nervosnetwork/ckb-sdk-core'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { CKB_NODE_RPC, CLASS_PRIVATE_KEY, SENDER_ADDRESS, RECEIVER_ADDRESS, REGISTRY_PRIVATE_KEY } from '../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

export const classLockScript = async (): Promise<CKBComponents.Script> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return {
    codeHash: secp256k1Dep.codeHash,
    hashType: secp256k1Dep.hashType,
    args: generateLockArgs(CLASS_PRIVATE_KEY),
  }
}

export const registryLockScript = async (): Promise<CKBComponents.Script> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return {
    codeHash: secp256k1Dep.codeHash,
    hashType: secp256k1Dep.hashType,
    args: generateLockArgs(REGISTRY_PRIVATE_KEY),
  }
}

export const generateLockArgs = (privateKey: Hex) => {
  const pubKey = ckb.utils.privateKeyToPublicKey(privateKey)
  return '0x' + ckb.utils.blake160(pubKey, 'hex')
}

export const secp256k1Dep = async (): Promise<CKBComponents.CellDep> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return { outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }
}

export const senderLockScript = (): CKBComponents.Script => {
  return addressToScript(SENDER_ADDRESS)
}

export const receiverLockScript = (): CKBComponents.Script => {
  return addressToScript(RECEIVER_ADDRESS)
}

export const alwaysSuccessLock = (): CKBComponents.Script => ({
  codeHash: '0x1157470ca9de091c21c262bf0754b777f3529e10d2728db8f6b4e04cfc2fbb5f',
  hashType: 'data',
  args: '0x',
})

export const alwaysSuccessCellDep = (): CKBComponents.CellDep => ({
  outPoint: {
    txHash: '0x46a7625a76cf7401eff1dfe4f46138be69316518c9771c9f780a428843c6b5b1',
    index: '0x0',
  },
  depType: 'code',
})
