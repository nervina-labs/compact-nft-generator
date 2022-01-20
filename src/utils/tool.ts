import { scriptToHash } from "@nervosnetwork/ckb-sdk-utils"
import CKB from '@nervosnetwork/ckb-sdk-core'
import { CKB_NODE_RPC } from '../utils/config'

const ckb = new CKB(CKB_NODE_RPC)

const parseScript = async () => {
  const type = {
    codeHash: "0x00000000000000000000000000000000000000000000000000545950455f4944",
    hashType: "type",
    args: "0x49b933a73fa4317df593505d8da06aec0be3d5dd5dc1b4603bf49cad3add292f"
  } as CKBComponents.Script
  console.log(scriptToHash(type))

}

parseScript()