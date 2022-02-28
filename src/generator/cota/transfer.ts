import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { transferCotaNFT } from '../../rpc/cota/transfer'
import { ALICE_ADDRESS, RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await transferCotaNFT({
    cotaLock: addressToScript(RECEIVER_ADDRESS),
    withdrawalLock: addressToScript(SENDER_ADDRESS),
    toLock: addressToScript(ALICE_ADDRESS),
  })
}

run()
