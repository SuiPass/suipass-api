import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GITHUB_CONFIG } from 'src/configs';
import { IProvider } from 'src/domain';
import { SuiClient } from 'src/infra';

export type GithubProviderProof = { authorizationCode: string };

@Injectable()
export class GithubProvider implements IProvider<GithubProviderProof> {
  constructor(private readonly suiclient: SuiClient) { }

  async verify({ proof }: { proof: GithubProviderProof }) {
    const { authorizationCode } = proof;

    const githubURL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CONFIG.GITHUB_CLIENT_ID}&client_secret=${GITHUB_CONFIG.GITHUB_CLIENT_SECRET}&code=${authorizationCode}`;

    const res = await axios.post(githubURL, undefined, {
      headers: {
        accept: 'application/json',
      },
    });

    const accessToken = res.data.access_token;

    if (accessToken) {
      return {
        sucess: true,
        data: { accessToken },
      };
    } else {
      return {
        sucess: false,
        data: res.data,
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

    this.suiclient.approveRequest(GITHUB_CONFIG.GITHUB_CAP, walletAddress);

    return res; // WARN: Dummy return
  }

  parseProof(raw: string): GithubProviderProof {
    return { authorizationCode: raw };
  }
}
