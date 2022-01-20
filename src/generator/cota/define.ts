import { defineCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xada01660e93a7464cd949fb65f44d2c37f3c4ee2313129f097197b23697d7577',
    index: '0x0',
  }
  await defineCotaNFT(cotaOutPoint)
}

run()
