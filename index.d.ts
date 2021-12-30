/// <reference types="@nervosnetwork/ckb-types" />
declare var TextEncoder: any
declare var TextDecoder: any

type Hex = string
type Byte = string
type Byte4 = string
type Byte20 = string
type Byte24 = string
type Byte32 = string
type Bytes = string


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
