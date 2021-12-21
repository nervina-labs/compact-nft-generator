export const FEE = BigInt(1000)

export const RegistryTypeScript: CKBComponents.Script = {
  codeHash: '0x3840d6b71a291f95430a24274206aa5b636319f17c955e780011c97d986070e3',
  hashType: 'type',
  args: '',
}

export const RegistryTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0x349d6ffa2b7d11238365b592bf93af48f7fff76542ec3b025d35f26ca6927654', index: '0x0' },
  depType: 'depGroup',
}

export const CotaTypeScript: CKBComponents.Script = {
  codeHash: '0x064b099b863a6cc7e9e6477975fb90dbd1ca698cc8b2daae5ef3365769204d97',
  hashType: 'type',
  args: '',
}

export const CotaTypeDep: CKBComponents.CellDep = {
  outPoint: { txHash: '0xe4e85beab47be030c8d858ced55ff5cb46997f155b1151405d08e6cd6ae30bb1', index: '0x0' },
  depType: 'depGroup',
}
