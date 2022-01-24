import { withdrawCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x59f9d0d5df54f374a6603a5e8f0c7f6b8b5d6a4f7ce7ec0a02d4d311eece4520',
    index: '0x0',
  }
  await withdrawCotaNFT(cotaOutPoint)
}

run()
