import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { VERISOUL_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type VerisoulProviderProof = { sessionId: string };

@Injectable()
export class VerisoulProvider implements IProvider<VerisoulProviderProof> {
  constructor() {}

  get cap() {
    return VERISOUL_CONFIG.VERISOUL_CAP;
  }

  parseProof(raw: string): VerisoulProviderProof {
    return { sessionId: raw };
  }

  async verify({
    proof,
  }: {
    proof: VerisoulProviderProof;
  }): Promise<VerificationResult> {
    return {} as any;
    // const { sessionId } = proof;
    //
    // const verisoulURL = `https://verisoul.com/login/oauth/access_token?client_id=${VERISOUL_CONFIG.VERISOUL_CLIENT_ID}&client_secret=${VERISOUL_CONFIG.VERISOUL_CLIENT_SECRET}&code=${sessionId}`;
    // const res = await axios.post(verisoulURL, undefined, {
    //   headers: {
    //     accept: 'application/json',
    //   },
    // });
    //
    // const accessToken = res.data.access_token;
    // if (!accessToken) {
    //   return {
    //     success: false,
    //     message: "Cannot get user's access_token",
    //   };
    // }
    //
    // // TODO: analyze user data and return the evident and level for that user
    // const userDetail = await axios.get('https://api.verisoul.com/user', {
    //   headers: {
    //     Accept: 'application/vnd.verisoul+json',
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // // Calculate
    // const createdAt = new Date(userDetail.data.created_at);
    // const now = new Date();
    // const diffInMs = now.getTime() - createdAt.getTime();
    // const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    //
    // const level = days >= 365 ? 3 : days >= 180 ? 2 : days >= 90 ? 1 : 0;
    // const evidence = JSON.stringify(userDetail.data);
    //
    // return {
    //   success: true,
    //   data: {
    //     evidence,
    //     level,
    //   },
    // };
  }

  async getSession(): Promise<{ sessionId: string }> {
    const verisoulURL = `https://api.sandbox.verisoul.ai/liveness/session`;
    const res = await axios.get(verisoulURL, {
      headers: {
        accept: 'application/json',
        'x-api-key': VERISOUL_CONFIG.VERISOUL_API_KEY,
      },
    });

    return {
      sessionId: res.data.session_id,
    };
  }
}
