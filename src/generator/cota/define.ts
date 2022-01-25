import { defineCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x1c80667c77b5ff36d57355c1fe508f75bf39dbf374a8cfe50fef7458a128fff2',
    index: '0x0',
  }
  await defineCotaNFT(cotaOutPoint)
}

run()
