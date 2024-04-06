import { Injectable } from '@nestjs/common';
import { SUI_PROVIDER_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';
import { SuiClient } from 'src/infra';

export type SuiProviderProof = { walletAddress: string };

@Injectable()
export class SuiProvider implements IProvider<SuiProviderProof> {
  constructor(private readonly suiclient: SuiClient) {}

  get cap() {
    return SUI_PROVIDER_CONFIG.SUI_PROVIDER_CAP;
  }

  parseProof(raw: any): SuiProviderProof {
    return raw;
  }

  async verify({
    proof,
  }: {
    proof: SuiProviderProof;
  }): Promise<VerificationResult> {
    const { walletAddress } = proof;
    const balance = await this.suiclient.getBalance(walletAddress);

    const level =
      balance >= 100000000000 // 100 SUI
        ? 3
        : balance >= 10000000000 // 10 SUI
          ? 2
          : balance >= 500000000 // 0.5 SUI
            ? 1
            : 0;
    const evidence = JSON.stringify({ address: walletAddress });

    return {
      success: true,
      data: {
        evidence,
        level,
      },
    };
  }
}
