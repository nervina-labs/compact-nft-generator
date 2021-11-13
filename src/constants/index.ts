export const FEE = BigInt(1000)
  
export const ClassTypeScript: CKBComponents.Script = {
    codeHash: '0x095b8c0b4e51a45f953acd1fcd1e39489f2675b4bc94e7af27bb38958790e3fc',
    hashType: 'type',
    args: '',
}

export const ClassTypeDep: CKBComponents.CellDep = {
    outPoint: { txHash: '0x3ecf42927509645dec38667d557dd9ba20d0d07267d769983495c1b6b9c70cc4', index: '0x1' },
    depType: 'code',
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
    outPoint: { txHash: '0x3ecf42927509645dec38667d557dd9ba20d0d07267d769983495c1b6b9c70cc4', index: '0x0' },
    depType: 'depGroup',
}