export interface SmtReq {}
export interface SmtResp {}

export interface DefineResp extends SmtResp {
  smtRootHash: Hex
  defineSmtEntry: Hex
}

export interface DefineReq extends SmtReq {
  lockHash: CKBComponents.Hash
  cotaId: Hex
  total: Hex
  issued: Hex
  configure: Hex
}

export interface MintWithdrawal {
  tokenIndex: Hex
  state: Hex
  characteristic: Hex
  toLockScript: Hex
}

export interface MintReq extends SmtReq {
  lockHash: CKBComponents.Hash
  cotaId: Hex
  outPoint: Hex
  withdrawals: MintWithdrawal[]
}

export interface MintResp extends SmtResp {
  smtRootHash: Hex
  mintSmtEntry: Hex
}

export interface Claim {
  cotaId: Hex
  tokenIndex: Hex
}

export interface ClaimReq extends SmtReq {
  lockScript: Hex
  withdrawal_lock_hash: Hex
  claims: Claim[]
}

export interface ClaimResp extends SmtResp {
  smtRootHash: Hex
  claimSmtEntry: Hex
}