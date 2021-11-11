import { classLockScript } from './account'
import { getCells } from './collector'

const run = async () => {
  const classLock = await classLockScript()
  const liveCells = await getCells(classLock)
  console.log(JSON.stringify(liveCells))
}

run()
