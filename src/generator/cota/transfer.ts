import { transferCotaNFT } from '../../rpc/cota/transfer'

const run = async () => {
  let cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x3a13a8fe99475c63d889bbed22ccef3ecdef5931b2d4021a67d9afc16ed02e50',
    index: '0x0',
  }
  let withdrawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0x5ecb163cbb48b219cad3e51250d7d6587839e6eaf06a7d7f942cd27b0305206d',
    index: '0x0',
  }
  await transferCotaNFT(cotaOutPoint, withdrawalOutPoint)
}

run()
