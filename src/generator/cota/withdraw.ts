import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { withdrawCotaNFT } from '../../rpc/cota'
import { SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await withdrawCotaNFT(addressToScript(SENDER_ADDRESS))
}

run()
