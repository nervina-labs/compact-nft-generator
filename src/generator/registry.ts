import { createRegistryCell, updateRegistryCell } from '../rpc/registry'
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from '../utils/config'

const run = async () => {
  await createRegistryCell()
  // const registryOutPoint: CKBComponents.OutPoint = {
  //   txHash: '0xb30aec8032f7ad2aa55cf198238bd41c4a735c4767640fa50b45fc9a951f892b',
  //   index: '0x0',
  // }
  // const cotaAddresses: string[] = [SENDER_ADDRESS, RECEIVER_ADDRESS]
  // await updateRegistryCell(registryOutPoint, cotaAddresses)
}

run()
