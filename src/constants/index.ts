export const FEE = BigInt(1600000)
export const MIN_CAPACITY = BigInt(61) * BigInt(100000000)

export const RegistryTypeScript: CKBComponents.Script = {
  codeHash: '0x9302db6cc1344b81a5efee06962abcb40427ecfcbe69d471b01b2658ed948075',
  hashType: 'type',
  args: '0xf9910364e0ca81a0e074f3aa42fe78cfcc880da6',
}

export const CotaTypeScript: CKBComponents.Script = {
  codeHash: '0x89cd8003a0eaf8e65e0c31525b7d1d5c1becefd2ea75bb4cff87810ae37764d8',
  hashType: 'type',
  args: '0x',
}

export const CotaTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0xeb8c99e9aaff64ffea5a97100fa9e6c23e59afe7ab9789cd882e3bb9a930c3ea', index: '0x0' },
  depType: 'depGroup',
}

export const AlwaysSuccessLockScript: CKBComponents.Script = {
  codeHash: '0x1157470ca9de091c21c262bf0754b777f3529e10d2728db8f6b4e04cfc2fbb5f',
  hashType: 'data',
  args: '0x',
}

export const AlwaysSuccessLockDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0x46a7625a76cf7401eff1dfe4f46138be69316518c9771c9f780a428843c6b5b1', index: '0x0' },
  depType: 'code',
}
