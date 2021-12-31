import { mintCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xfd545e011200d4a2af77ff8a3044e09458ac13580ff71beb71f1eb244a74afdb',
    index: '0x0',
  }
  await mintCotaNFT(cotaOutPoint)
}

run()
