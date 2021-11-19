import { claimCompactNFTFromMint } from '../rpc/compact'

const run = async () => {
  const compactNFTOutPoint: CKBComponents.OutPoint = {
    txHash: '0xb30aec8032f7ad2aa55cf198238bd41c4a735c4767640fa50b45fc9a951f892b',
    index: '0x1',
  }
  const classMintOutPoint: CKBComponents.OutPoint = {
    txHash: '0x9943670fc0985522744b5c3557d1e8a80151f9b482ad3549e47bc6b53cd587e7',
    index: '0x0',
  }
  await claimCompactNFTFromMint(compactNFTOutPoint, classMintOutPoint)
}

run()
