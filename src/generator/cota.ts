import { claimCotaNFT, withdrawCotaNFT } from '../rpc/cota'

const run = async () => {
  // const cotaOutPoint: CKBComponents.OutPoint = {
  //   txHash: '0xbfa0d4d9e7b3a64bae320eafa32cd26079d351ae8953d511bd322544fc2ba94a',
  //   index: '0x0',
  // }
  // await withdrawCotaNFT(cotaOutPoint)

  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x7a5a3faa6957b03869ec269357a1e994f3802d3a06e33f4627c4e3bbbb04e3de',
    index: '0x1',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0xd302631846a06cab34f7d89e7d5403b3e26ddc52967bcf6002c81265fb46e4be',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()