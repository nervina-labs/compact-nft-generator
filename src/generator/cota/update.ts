import { updateCotaNFT } from '../../rpc/cota'

const run = async () => {
  const cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0x4ed92e399a5b0813cbefcbe965e3c826dea344bc73475bd2e9b411c943de3660',
    index: '0x0',
  }
  await updateCotaNFT(cotaOutPoint)
}

run()
