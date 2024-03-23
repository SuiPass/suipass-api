import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GITHUB_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type TwitterProviderProof = { authorizationCode: string };

@Injectable()
export class TwitterProvider implements IProvider<TwitterProviderProof> {
  constructor() { }

  get cap() {
    return GITHUB_CONFIG.GITHUB_CAP;
  }

  async verify({
    proof,
  }: {
    proof: TwitterProviderProof;
  }): Promise<VerificationResult> {
    const { authorizationCode } = proof;

    const githubURL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CONFIG.GITHUB_CLIENT_ID}&client_secret=${GITHUB_CONFIG.GITHUB_CLIENT_SECRET}&code=${authorizationCode}`;

    const res = await axios.post(githubURL, undefined, {
      headers: {
        accept: 'application/json',
      },
    });

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
