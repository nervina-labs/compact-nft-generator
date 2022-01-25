import { claimCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x26a8e182f7c4a47f754c79647bab995d1c9a87272d181c1b70a1648f1aac52c9',
    index: '0x0',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0xbadda5900bcfe55e35a9205ced23768f4905512bdb600437e7069644947f81c5',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()
