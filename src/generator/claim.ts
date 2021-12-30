import { claimCotaNFT } from '../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x49fdb28bb57c51817c30c7dc4e3b2eccf8a93b20eecf4b41abfa64ed0cb52b30',
    index: '0x2',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0xac4f52d57d620ee5dd28ae00a6641f8f88571f183ba4221c5c74dc33a1d5e99c',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()
