import { mintCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x364d35b31422486350a41f6f386e05a8ed3a9a5c2a7c8db3571accd1c4ade0b5',
    index: '0x0',
  }
  await mintCotaNFT(cotaOutPoint)
}

run()
