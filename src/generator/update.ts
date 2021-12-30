import { updateCotaNFT } from '../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xe9f2e974b4b6652e1dc80a23e03924a15d587d0fd86efd17697a41649fb720a6',
    index: '0x0',
  }
  await updateCotaNFT(cotaOutPoint)
}

run()
