import { updateRegistryCell } from '../../rpc/registry'
import { ALICE_ADDRESS, BOB_ADDRESS, RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0x462244c2f376db009ebae265eb29fed2184f720e0a62de4a6432d018444b50cf',
    index: '0x0',
  }
  const cotaAddresses: string[] = [ALICE_ADDRESS, BOB_ADDRESS, SENDER_ADDRESS, RECEIVER_ADDRESS]
  await updateRegistryCell(registryOutPoint, cotaAddresses)
}

run()