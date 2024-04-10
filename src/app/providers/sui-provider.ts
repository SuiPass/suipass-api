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
    const depositTxb = await this.suiclient.getDepositTxnBlock(walletAddress);
    // Calculate
    const createdAt = new Date(depositTxb.timestampMs);
    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();
    // Apply some condition here
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const level = (() => {
      if (balance > 10000000000 && days > 364) return 3;
      else if (balance > 5000000000 && days > 179) return 2;
      else if (balance > 1000000000) return 1;
      else return 0;
    })();

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
