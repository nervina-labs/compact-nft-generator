import { updateRegistryCell } from '../../rpc/registry'
import { ALICE_ADDRESS, BOB_ADDRESS, RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0xab7fd96821a043e1d599ca53d1c3b8f1943c3d96fa89ccef7396632adfbf0ae4',
    index: '0x0',
  }
  const cotaAddresses: string[] = [SENDER_ADDRESS, RECEIVER_ADDRESS, ALICE_ADDRESS, BOB_ADDRESS]
  await updateRegistryCell(registryOutPoint, cotaAddresses)
}

run()