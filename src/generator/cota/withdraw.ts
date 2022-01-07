import { withdrawCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x7354ad8975e2e877d86306dc3da40378dad857509604f0c4d10a4014bc9dbf80',
    index: '0x0',
  }
  await withdrawCotaNFT(cotaOutPoint)
}

run()
