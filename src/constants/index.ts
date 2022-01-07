export const FEE = BigInt(1500)
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
  outPoint: { txHash: '0x6efe711f781d801aca8bf10378037ef18313837908f63eb6a4d1be382eaa4e55', index: '0x0' },
  depType: 'depGroup',
}
