/// <reference types="@nervosnetwork/ckb-types" />
declare var TextEncoder: any
declare var TextDecoder: any

type Hex = string

interface IndexerCell {
  blockNumber: CKBComponents.BlockNumber
  outPoint: CKBComponents.OutPoint
  output: CKBComponents.CellOutput
  outputData: Hex[]
  txIndex: Hex
}
type IndexerCells = {
  objects: IndexerCell[]
  lastCursor: Hex
}
type IndexerResponse = {
  jsonrpc: string
  result: IndexerCells
  id: number
}
