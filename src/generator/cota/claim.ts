import { claimCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xe03da087334a1d88500a17ab7f3aab2a114d371d9caa43d15e3846a8535eb676',
    index: '0x0',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0x6fcd985447407b95d92f4ee6f7b8093e9b38c1e79f5440c7546fcce113f0b9cc',
    index: '0x0',
  }
  await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
}

run()
