import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { updateRegistryCell } from '../../rpc/registry'
import { ALICE_ADDRESS, BOB_ADDRESS, RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0xb61bcb5174dd0a71065a059991f00eb23d364f81bcd266df286c33d8ebafeedb',
    index: '0x0',
  }
  const cotaAddresses: string[] = ['ckb1qyq0mpgkgasqskx8sgsuewyqy5kprqfmxkas49888k']
  const cotaLocks = cotaAddresses.map(address => addressToScript(address))
  await updateRegistryCell(registryOutPoint, cotaLocks)
}

run()
