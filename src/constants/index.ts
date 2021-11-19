export const FEE = BigInt(1000)

export const ClassTypeScript: CKBComponents.Script = {
  codeHash: '0x4b488e0893b7aba6543282be74a58eee1fd8039c1b31cc2481257ad7db8259f5',
  hashType: 'type',
  args: '',
}

export const ClassTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0xb4c14c234c2fd387cd826fe86c59e9726ec31d13a46021d9cd048f9a2babe295', index: '0x0' },
  depType: 'depGroup',
}

export const RegistryTypeScript: CKBComponents.Script = {
  codeHash: '0x3a6897ab78ad10d028d0c5ef375545e66bfdffd01f3a369b5b07906078e04f6d',
  hashType: 'type',
  args: '',
}

export const RegistryTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0x4410efbdfb83c58198a10eae621a3169c4f8f776cb4c2dd61b69947b1f4b922a', index: '0x0' },
  depType: 'depGroup',
}

export const CompactNFTTypeScript: CKBComponents.Script = {
  codeHash: '0xdca728b2220d4026ae4295915ca3dfb586bdf75dab7bf14b20373899588d8689',
  hashType: 'type',
  args: '',
}

export const CompactNFTTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0x0a8c43334160702b8beccf922ea35e06f884eaa50731b5704a09edfbc5f02a62', index: '0x0' },
  depType: 'depGroup',
}
