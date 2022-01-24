import { defineCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xada588e559ead7bdf10cd42c5f0a2429de9c0b4e2a198f73132c0488fd64863e',
    index: '0x1',
  }
  await defineCotaNFT(cotaOutPoint)
}

run()
