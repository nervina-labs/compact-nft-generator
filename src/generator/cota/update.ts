import { updateCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x972b92a61ceff6ec94dd7d254b8799a968d9be4fd4e16f3c6ca89ecb72107f73',
    index: '0x0',
  }
  await updateCotaNFT(cotaOutPoint)
}

run()
