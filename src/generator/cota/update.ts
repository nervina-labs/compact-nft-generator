import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { updateCotaNFT } from '../../rpc/cota'
import { SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await updateCotaNFT(addressToScript(SENDER_ADDRESS))
}

run()
