export interface IProvider<T> {
  get cap(): string;
  parseProof(raw: string): T;
  verify(payload: { proof: T }): Promise<VerificationResult>;
}

export type VerificationResult =
  | {
    success: true;
    data: { evidence: string; level: number };
  }
  | {
    success: false;
    message: string;
  };
