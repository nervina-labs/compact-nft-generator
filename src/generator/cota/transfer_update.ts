import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { transferUpdateCotaNFT } from '../../rpc/cota'
import { ALICE_ADDRESS, BOB_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await transferUpdateCotaNFT({
    cotaLock: addressToScript(ALICE_ADDRESS),
    withdrawalLock: addressToScript(SENDER_ADDRESS),
    toLock: addressToScript(BOB_ADDRESS),
  })
}

run()
