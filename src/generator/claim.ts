import { claimCotaNFT, defineCotaNFT, withdrawCotaNFT } from '../rpc/cota'

const run = async () => {
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
