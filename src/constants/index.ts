export const FEE = BigInt(1600)
export const MIN_CAPACITY = BigInt(61) * BigInt(100000000)

export const RegistryTypeScript: CKBComponents.Script = {
  codeHash: '0x243e92edb5767b445560260b838261a2c79b7b40b806d6f86fa6f40a427b879c',
  hashType: 'type',
  args: '',
}

export const CotaTypeScript: CKBComponents.Script = {
  codeHash: '0x0057b351bf489c3b93649566a5d5511d845f1744b2c1b6599f1198ed9d0d4378',
  hashType: 'type',
  args: '',
}

export const CotaTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0x5a6e7159b1cb79b82aed0d579a7b298ac4b6523be689ace019219fc697a77eaf', index: '0x0' },
  depType: 'depGroup',
}
