import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TWITTER_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type TwitterProviderProof = { authorizationCode: string };

@Injectable()
export class TwitterProvider implements IProvider<TwitterProviderProof> {
  constructor() {}

  get cap() {
    return TWITTER_CONFIG.TWITTER_CAP;
  }

  async verify({
    proof,
  }: {
    proof: TwitterProviderProof;
  }): Promise<VerificationResult> {
    const { authorizationCode } = proof;

    const basicAuthToken = Buffer.from(
      `${TWITTER_CONFIG.TWITTER_CLIENT_ID}:${TWITTER_CONFIG.TWITTER_CLIENT_SECRET}`,
      'utf8',
    ).toString('base64');

    const twitterOauthTokenParams = {
      client_id: TWITTER_CONFIG.TWITTER_CLIENT_ID,
      code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
      redirect_uri: `https://suipass.xyz?suipassProvider=twitter`,
      grant_type: 'authorization_code',
      code: authorizationCode,
    };

    const twitterURL = `https://api.twitter.com/2/oauth2/token`;

    const res = await axios.post(
      twitterURL,
      new URLSearchParams(twitterOauthTokenParams).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuthToken}`,
        },
      },
    );

    const accessToken = res.data.access_token;

    // TODO: analyze user data and return the evident and level for that user
    const evidence =
      'using some protocol to generate the evident of user from their data with out revealing their data';
    const level = 1;

    if (accessToken) {
      return {
        success: true,
        data: {
          evidence,
          level,
        },
      };
    } else {
      return {
        success: false,
        message: "Cannot get user's access_token",
      };
    }
  }

  parseProof(raw: string): TwitterProviderProof {
    return { authorizationCode: raw };
  }
}
