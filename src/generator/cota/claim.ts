import { claimCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xd2ac093bf7f32a6f4825cfb20d2ffa1ba3ee68393c9d182f7e1488463b01ebb2',
    index: '0x2',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0x3a13a8fe99475c63d889bbed22ccef3ecdef5931b2d4021a67d9afc16ed02e50',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()
