import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { claimCotaNFT } from '../../rpc/cota'
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await claimCotaNFT(addressToScript(RECEIVER_ADDRESS), addressToScript(SENDER_ADDRESS))
}

run()
