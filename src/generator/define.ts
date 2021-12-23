import { defineCotaNFT } from '../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x49fdb28bb57c51817c30c7dc4e3b2eccf8a93b20eecf4b41abfa64ed0cb52b30',
    index: '0x1',
  }
  await defineCotaNFT(cotaOutPoint)
}

run()
