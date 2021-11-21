import { claimCompactNFT, claimCompactNFTFromMint, withdrawCompactNFT } from '../rpc/compact'

const run = async () => {
  // const compactNFTOutPoint: CKBComponents.OutPoint = {
  //   txHash: '0xb30aec8032f7ad2aa55cf198238bd41c4a735c4767640fa50b45fc9a951f892b',
  //   index: '0x1',
  // }
  // const classMintOutPoint: CKBComponents.OutPoint = {
  //   txHash: '0x9943670fc0985522744b5c3557d1e8a80151f9b482ad3549e47bc6b53cd587e7',
  //   index: '0x0',
  // }
  // await claimCompactNFTFromMint(compactNFTOutPoint, classMintOutPoint)

  // const compactNFTOutPoint: CKBComponents.OutPoint = {
  //   txHash: '0xbfa0d4d9e7b3a64bae320eafa32cd26079d351ae8953d511bd322544fc2ba94a',
  //   index: '0x0',
  // }
  // await withdrawCompactNFT(compactNFTOutPoint)


  const compactNFTOutPoint: CKBComponents.OutPoint = {
    txHash: '0x7a5a3faa6957b03869ec269357a1e994f3802d3a06e33f4627c4e3bbbb04e3de',
    index: '0x1',
  }
  const withdawalMintOutPoint: CKBComponents.OutPoint = {
    txHash: '0xd302631846a06cab34f7d89e7d5403b3e26ddc52967bcf6002c81265fb46e4be',
    index: '0x0',
  }
  await claimCompactNFT(compactNFTOutPoint, withdawalMintOutPoint)
}

run()
