import { withdrawCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xab1fd586ff1181ef28617005295ff3aceb38d03433191b6e06dfa5abe33ac80c',
    index: '0x0',
  }
  await withdrawCotaNFT(cotaOutPoint)
}

run()
