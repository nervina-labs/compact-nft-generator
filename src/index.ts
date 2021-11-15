import { addressToScript, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { registerCompactNFT } from './aggregator'
import { getCells } from './collector'
import { SENDER_ADDRESS } from './utils/config'

const run = async () => {
  const senderLock = addressToScript(SENDER_ADDRESS)
  const senderLockHash = (scriptToHash(senderLock))
  const liveCells = await getCells(senderLock)
  console.log(JSON.stringify(liveCells))

  const response = await registerCompactNFT([senderLockHash])
  console.log(response[0])
  console.log(response[1])
}

run()
