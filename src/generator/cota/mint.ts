import { mintCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xb0a67f3357173991689bb05d698a5cabb9a95b0fcec2b1640e55b2835e3bcce8',
    index: '0x0',
  }
  await mintCotaNFT(cotaOutPoint)
}

run()
