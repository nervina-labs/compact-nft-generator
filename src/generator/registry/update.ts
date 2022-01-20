import { updateRegistryCell } from '../../rpc/registry'
import { ALICE_ADDRESS, BOB_ADDRESS, RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  const registryOutPoint: CKBComponents.OutPoint = {
    txHash: '0xd2ac093bf7f32a6f4825cfb20d2ffa1ba3ee68393c9d182f7e1488463b01ebb2',
    index: '0x0',
  }
  const cotaAddresses: string[] = [ALICE_ADDRESS, BOB_ADDRESS, SENDER_ADDRESS, RECEIVER_ADDRESS]
  await updateRegistryCell(registryOutPoint, cotaAddresses)
}

run()