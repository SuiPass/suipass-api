import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DISCORD_CONFIG, GITHUB_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type DiscordProviderProof = { authorizationCode: string };
type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  createdAt: number;
};

@Injectable()
export class DiscordProvider implements IProvider<DiscordProviderProof> {
  constructor() {}

  get cap() {
    return GITHUB_CONFIG.GITHUB_CAP;
  }

  parseProof(raw: string): DiscordProviderProof {
    return { authorizationCode: raw };
  }

  async verify({
    proof,
  }: {
    proof: DiscordProviderProof;
  }): Promise<VerificationResult> {
    const { authorizationCode } = proof;

    const accessTokenData: TokenResponse =
      await this.exchangeCodeForToken(authorizationCode);

    const userDetail = await this.getUserInfo(accessTokenData.access_token);
    const creationDate = this.getAccountCreationDate(userDetail.id);
    userDetail.createdAt = creationDate.getTime();

    // Calculate
    const createdAt = new Date(userDetail.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const level = days >= 365 ? 3 : days >= 180 ? 2 : days >= 90 ? 1 : 0;
    const evidence = JSON.stringify(userDetail);

    return {
      success: true,
      data: {
        evidence,
        level,
      },
    };
  }

  private async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const tokenUrl = 'https://discord.com/api/oauth2/token';

    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: DISCORD_CONFIG.DISCORD_CLIENT_ID,
      client_secret: DISCORD_CONFIG.DISCORD_CLIENT_SECRET,
      redirect_uri: DISCORD_CONFIG.DISCORD_REDIRECT_URI,
      code,
    });

    try {
      const response = await axios.post<TokenResponse>(tokenUrl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  private async getUserInfo(accessToken: string): Promise<DiscordUser | null> {
    try {
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const userData: DiscordUser = response.data;
        return userData;
      } else {
        console.error(
          'Error fetching user info:',
          response.status,
          response.statusText,
        );
        return null;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  getAccountCreationDate(userId: string): Date {
    // Discord snowflake (ID) is a 64-bit integer
    const snowflake = BigInt(userId);

    // The first 42 bits of the snowflake represent milliseconds since Discord Epoch
    const discordEpoch = 1420070400000n; // Discord Epoch (2015-01-01T00:00:00.000Z)
    const timestamp = Number((snowflake >> 22n) + discordEpoch);

    return new Date(timestamp);
  }
}
