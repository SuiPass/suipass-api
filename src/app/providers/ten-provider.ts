import { Injectable } from '@nestjs/common';
import { TEN_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type TenProviderProof = {};

@Injectable()
export class TenProvider implements IProvider<TenProviderProof> {
  get cap(): string {
    return TEN_CONFIG.TEN_CAP;
  }
  parseProof(raw: string): TenProviderProof {
    return {};
  }
  verify(payload: { proof: TenProviderProof }): Promise<VerificationResult> {
    return (async () => {
      return {
        success: true,
        data: { evidence: 'random', level: 1 },
      };
    })();
  }
}
