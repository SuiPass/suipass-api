import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CONFIG } from 'src/configs/provider.config';
import { IProvider } from 'src/domain';
import { SuiClient } from 'src/infra';

export type GoogleProviderProof = { authorizationCode: string };

@Injectable()
export class GoogleProvider implements IProvider<GoogleProviderProof> {
  private oauth2Client: OAuth2Client;
  constructor(private readonly suiclient: SuiClient) {
    this.oauth2Client = new OAuth2Client(
      GOOGLE_CONFIG.GOOGLE_CLIENT_ID,
      GOOGLE_CONFIG.GOOGLE_CLIENT_SECRET,
    );
  }

  async verify({ proof }: { proof: GoogleProviderProof }) {
    const { authorizationCode } = proof;

    try {
      const { tokens } = await this.oauth2Client.getToken(authorizationCode);
      if (tokens) {
        return {
          sucess: true,
          data: { tokens },
        };
      }
    } catch (err) {
      return {
        sucess: false,
        data: err.response.data,
      };
    }
  }

  async consumeRequest(
    walletAddress: string,
    proof: string,
  ): Promise<{ sucess: boolean; message?: string; data?: any }> {
    const res = await this.verify({ proof: this.parseProof(proof) });

    // TODO: Analyze something
    console.log(res.data);

    this.suiclient.approveRequest(GOOGLE_CONFIG.GOOGLE_CAP, walletAddress);

    return res; // WARN: Dummy return
  }

  parseProof(raw: string): GoogleProviderProof {
    return { authorizationCode: raw };
  }
}
