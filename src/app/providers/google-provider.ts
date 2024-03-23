import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CONFIG } from 'src/configs/provider.config';
import { IProvider, VerificationResult } from 'src/domain';

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

  get cap() {
    return GOOGLE_CONFIG.GOOGLE_CAP;
  }

  async verify({
    proof,
  }: {
    proof: GoogleProviderProof;
  }): Promise<VerificationResult> {
    const { authorizationCode } = proof;

    try {
      const { tokens } = await this.oauth2Client.getToken(authorizationCode);

      // TODO: analyze user data and return the evident and level for that user
      const evidence =
        'using some protocol to generate the evident of user from their data with out revealing their data';
      const level = 1;

      if (tokens) {
        return {
          success: true,
          data: {
            evidence,
            level,
          },
        };
      }
    } catch (err) {
      return {
        success: false,
        message: `Error: ${err}`,
      };
    }
  }

  parseProof(raw: string): GoogleProviderProof {
    return { authorizationCode: raw };
  }
}
