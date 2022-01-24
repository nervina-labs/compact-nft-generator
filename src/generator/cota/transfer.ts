import { transferCotaNFT } from '../../rpc/cota/transfer'

const run = async () => {
  let cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xada588e559ead7bdf10cd42c5f0a2429de9c0b4e2a198f73132c0488fd64863e',
    index: '0x3',
  }
  let withdrawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0x46e24443653f2f3661648ec8651fcb3ff2fc993fbb26263e5daa4eacc7dc481b',
    index: '0x0',
  }
  await transferCotaNFT(cotaOutPoint, withdrawalOutPoint)
}

run()
