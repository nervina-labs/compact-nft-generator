import { claimCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xac4f52d57d620ee5dd28ae00a6641f8f88571f183ba4221c5c74dc33a1d5e99c',
    index: '0x0',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0xc1157f33453b266091db7b4326b2adfa5d16f005a289afd33f189d91c3f02f69',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()
