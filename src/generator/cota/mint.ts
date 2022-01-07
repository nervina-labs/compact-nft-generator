import { mintCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x732db245c7420ebd200bc794680c503e48c790204a02011285e206b16fb0f319',
    index: '0x0',
  }
  await mintCotaNFT(cotaOutPoint)
}

run()
