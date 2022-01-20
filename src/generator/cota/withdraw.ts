import { withdrawCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xe93288287e35f3a3e72d84ef04ea8fa4c25a380705a4a3b2f342fa0d7639177a',
    index: '0x0',
  }
  await withdrawCotaNFT(cotaOutPoint)
}

run()
