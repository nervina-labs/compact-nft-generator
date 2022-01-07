import { updateCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x6dd522975b1ffb7ab7e00a55d8ea51cb7d2569314759f9ad69f99a018ee7da33',
    index: '0x0',
  }
  await updateCotaNFT(cotaOutPoint)
}

run()
