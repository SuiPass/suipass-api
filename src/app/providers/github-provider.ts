import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GITHUB_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type GithubProviderProof = { authorizationCode: string };

@Injectable()
export class GithubProvider implements IProvider<GithubProviderProof> {
  constructor() {}

  get cap() {
    return GITHUB_CONFIG.GITHUB_CAP;
  }

  parseProof(raw: string): GithubProviderProof {
    return { authorizationCode: raw };
  }

  async verify({
    proof,
  }: {
    proof: GithubProviderProof;
  }): Promise<VerificationResult> {
    const { authorizationCode } = proof;

    const githubURL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CONFIG.GITHUB_CLIENT_ID}&client_secret=${GITHUB_CONFIG.GITHUB_CLIENT_SECRET}&code=${authorizationCode}`;
    const res = await axios.post(githubURL, undefined, {
      headers: {
        accept: 'application/json',
      },
    });

    const accessToken = res.data.access_token;
    if (!accessToken) {
      return {
        success: false,
        message: "Cannot get user's access_token",
      };
    }

    // TODO: analyze user data and return the evident and level for that user
    const userDetail = await axios.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Calculate
    const createdAt = new Date(userDetail.data.created_at);
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - createdAt.getTime();
    const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    const level = days >= 365 ? 3 : days >= 180 ? 2 : days >= 90 ? 1 : 0;
    const evidence = JSON.stringify(userDetail.data);

    return {
      success: true,
      data: {
        evidence,
        level,
      },
    };
  }
}
