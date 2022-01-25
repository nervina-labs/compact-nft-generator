import { mintCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xa1e030eb012a1f0fb16947103312da77993f24c6fc08c89ab22a98d48b62d7b5',
    index: '0x0',
  }
  await mintCotaNFT(cotaOutPoint)
}

run()
