import { updateRegistryCell } from '../../rpc/registry'
import { ALICE_ADDRESS, BOB_ADDRESS } from '../../utils/config'

const run = async () => {
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0x49fdb28bb57c51817c30c7dc4e3b2eccf8a93b20eecf4b41abfa64ed0cb52b30',
    index: '0x0',
  }
  const cotaAddresses: string[] = [ALICE_ADDRESS, BOB_ADDRESS]
  await updateRegistryCell(registryOutPoint, cotaAddresses)
}

run()