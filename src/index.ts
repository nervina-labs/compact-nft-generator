import { classLockScript } from './account'
import { registerCompactNFT } from './aggregator'
import { getCells } from './collector'

const run = async () => {
  const classLock = await classLockScript()
  const liveCells = await getCells(classLock)
  console.log(JSON.stringify(liveCells))

  const response = await registerCompactNFT(classLock)
  console.log(response)
}

run()
