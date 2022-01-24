import { updateCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xfd94032c4606294db8766fc95d534007c28548b2f55be9fbaa262a5eda5223ab',
    index: '0x0',
  }
  await updateCotaNFT(cotaOutPoint)
}

run()
