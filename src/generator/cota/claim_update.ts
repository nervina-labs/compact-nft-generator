import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { claimUpdateCotaNFT } from '../../rpc/cota'
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await claimUpdateCotaNFT(addressToScript(RECEIVER_ADDRESS), addressToScript(SENDER_ADDRESS))
}

run()
