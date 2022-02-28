import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { mintCotaNFT } from '../../rpc/cota'
import { SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await mintCotaNFT(addressToScript(SENDER_ADDRESS))
}

run()
