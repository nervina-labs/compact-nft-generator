import { createRegistryCell, updateRegistryCell } from '../rpc/registry'
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from '../utils/config'

const run = async () => {
  // await createRegistryCell()
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0x5450344a3c73bf9bcd13d374498d28ca4c3194bc79f5a9c2da7d0f6e6ba6fbba',
    index: '0x0',
  }
  const cotaAddresses: string[] = [SENDER_ADDRESS, RECEIVER_ADDRESS]
  await updateRegistryCell(registryOutPoint, cotaAddresses)
}

run()
