import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { defineCotaNFT } from '../../rpc/cota'
import { SENDER_ADDRESS } from '../../utils/config'

const run = async () => {
  await defineCotaNFT(addressToScript(SENDER_ADDRESS))
}

run()
