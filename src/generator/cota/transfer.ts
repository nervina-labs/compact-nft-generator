import { claimCotaNFT, withdrawCotaNFT } from '../../rpc/cota'
import { transferCotaNFT } from '../../rpc/cota/transfer'

const run = async () => {
  let cotaOutPoint: CKBComponents.OutPoint = {
    txHash: '0xe02b592cb075015259bed46f3f5c62123eeb462ce41252390084953ddb5705a0',
    index: '0x0',
  }
  const withdawalOutPoint: CKBComponents.OutPoint = {
    txHash: '0xada01660e93a7464cd949fb65f44d2c37f3c4ee2313129f097197b23697d7577',
    index: '0x0',
  }
  
  const {txHash, withdrawalLockHash, cotaOutput} = await claimCotaNFT(cotaOutPoint, withdawalOutPoint)
  setTimeout(async () => {
    let cotaOutPoint = {
      txHash,
      index: '0x0',
    }
    await transferCotaNFT(cotaOutPoint, withdrawalLockHash, cotaOutput)
  }, 1000)
  
}

run()
