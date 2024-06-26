export * from './enterprise';

export type Suipass = {
  id: string;
  providers: Provider[];
  threshold: number;
  expirationPeriod: number;
};

export type Provider = {
  id: string;
  name: string;
  desc: string;
  logoUrl: string;
  submitFee: string;
  updateFee: string;
  balance: number;
  maxLevel: number;
  maxScore: number;
  levels: Level[];
  records: Record[];
  requests: Request[];
  disabled: boolean;
};

export type Level = {
  desc: string;
  level: number;
};

export type Record = {
  requester: string;
  level: number;
  evidence: string;
};

export type Request = {
  id: string;
  requester: string;
  proof: string;
};

export type Approval = {
  id: string;
  provider: string;
  level: number;
  evidence: string;
  issuedDate: number;
};

// WARN: wrong place
export type UserDetail = {
  address: string;
  approvals: Approval[];
  totalScore: number;
};
