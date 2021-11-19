import { createRegistryCell, updateRegistryCell } from '../rpc/registry'
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from '../utils/config'

const run = async () => {
  // await createRegistryCell()
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0xb30aec8032f7ad2aa55cf198238bd41c4a735c4767640fa50b45fc9a951f892b',
    index: '0x0',
  }
  const compactNFTAddresses: string[] = ["ckt1qyqgec0t3em4tkn2hm5ce8ltqclltfgfs39q4vg5h7"]
  await updateRegistryCell(registryOutPoint, compactNFTAddresses)
}

run()
