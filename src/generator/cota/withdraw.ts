import { withdrawCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xa6d65e3117e4b15beb69a9a267b4c7e042d3e9a84733fe6f1fa3a07b747dff51',
    index: '0x0',
  }
  await withdrawCotaNFT(cotaOutPoint)
}

run()
