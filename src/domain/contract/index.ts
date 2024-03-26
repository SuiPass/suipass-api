export type Suipass = {
  id: string;
  providers: Provider[];
  threshold: number;
  expirationPeriod: number;
};

export type Provider = {
  id: string;
  name: string;
  submitFee: string;
  updateFee: string;
  balance: number;
  maxLevel: number;
  maxScore: number;
  records: Record[];
  requests: Request[];
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
