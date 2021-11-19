import { createRegistryCell, updateRegistryCell } from '../rpc/registry'
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from '../utils/config'

const run = async () => {
  // await createRegistryCell()
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0xa14eabfb7a5827733a8717e2460168313145a69b6e631e6e044be37f190571f2',
    index: '0x0',
  }
  const compactNFTAddresses: string[] = [SENDER_ADDRESS]
  await updateRegistryCell(registryOutPoint, compactNFTAddresses)
}

run()
