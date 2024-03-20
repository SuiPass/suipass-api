import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CONFIG } from 'src/configs/provider.config';
import { IProvider } from 'src/domain';

export type GoogleProviderProof = { authorizationCode: string };

@Injectable()
export class GoogleProvider implements IProvider<GoogleProviderProof> {
  private oauth2Client: OAuth2Client;
  constructor() {
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
}
