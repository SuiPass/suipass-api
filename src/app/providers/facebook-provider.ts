import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DISCORD_CONFIG, FACEBOOK_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type FacebookProviderProof = { authorizationCode: string };
type TokenResponse = {
  access_token: string;
  token_type: string;
};

@Injectable()
export class FacebookProvider implements IProvider<FacebookProviderProof> {
  constructor() {}

  get cap() {
    return FACEBOOK_CONFIG.FACEBOOK_CAP;
  }

  parseProof(raw: string): FacebookProviderProof {
    return { authorizationCode: raw };
  }

  async verify({
    proof,
  }: {
    proof: FacebookProviderProof;
  }): Promise<VerificationResult> {
    const { authorizationCode } = proof;

    const accessTokenData: TokenResponse =
      await this.exchangeCodeForToken(authorizationCode);

    const userDetail = await this.getUserInfo(accessTokenData.access_token);
    console.log(userDetail);

    // // Calculate
    // const createdAt = new Date(userDetail.createdAt);
    // const now = new Date();
    // const diffInMs = now.getTime() - createdAt.getTime();
    // const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    //
    // const level = days >= 365 ? 3 : days >= 180 ? 2 : days >= 90 ? 1 : 0;
    const evidence = JSON.stringify(userDetail);

    return {
      success: true,
      data: {
        evidence,
        level: 1,
      },
    };
  }

  private async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const tokenUrl = 'https://graph.facebook.com/v12.0/oauth/access_token';
    const params = new URLSearchParams({
      client_id: FACEBOOK_CONFIG.FACEBOOK_CLIENT_ID,
      client_secret: FACEBOOK_CONFIG.FACEBOOK_CLIENT_SECRET,
      redirect_uri: FACEBOOK_CONFIG.FACEBOOK_REDIRECT_URI,
      code: code,
    });

    try {
      const response = await axios.get(`${tokenUrl}?${params.toString()}`);
      const { access_token, token_type } = response.data;
      return { access_token, token_type };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  private async getUserInfo(accessToken: string) {
    const userInfoUrl = 'https://graph.facebook.com/v12.0/me';
    const fields = [
      'id',
      'name',
      'first_name',
      'last_name',
      'middle_name',
      'name_format',
      'picture',
      'short_name',
      'email',
      'gender',
      'birthday',
      'hometown',
      'location',
      'about',
      'languages',
      'education',
      'work',
      'website',
      'relationship_status',
      'significant_other',
      'link',
      'age_range',
      'friends',
      'likes',
      'posts',
      'albums',
      'videos',
    ].join(',');

    const params = new URLSearchParams({
      fields: fields,
      access_token: accessToken,
    });

    try {
      const response = await axios.get(`${userInfoUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
}
