import { defineCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xd2ac093bf7f32a6f4825cfb20d2ffa1ba3ee68393c9d182f7e1488463b01ebb2',
    index: '0x3',
  }
  await defineCotaNFT(cotaOutPoint)
}

run()
