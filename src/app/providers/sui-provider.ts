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

  parseProof(raw: string): SuiProviderProof {
    return { walletAddress: raw };
  }

  async verify({
    proof,
  }: {
    proof: SuiProviderProof;
  }): Promise<VerificationResult> {
    const { walletAddress } = proof;
    const balance = await this.suiclient.getBalance(walletAddress);

    const level =
      balance >= 100 ? 3 : balance >= 10 ? 2 : balance >= 0.5 ? 1 : 0;
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
