import { claimCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xada588e559ead7bdf10cd42c5f0a2429de9c0b4e2a198f73132c0488fd64863e',
    index: '0x4',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0xa8d81e8e893bc505ef5a132627a0d13a196020a59035d3c51b6451ac462e861a',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()
