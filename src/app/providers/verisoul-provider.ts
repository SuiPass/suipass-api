import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { VERISOUL_CONFIG } from 'src/configs';
import { IProvider, VerificationResult } from 'src/domain';

export type VerisoulProviderProof = { sessionId: string };

const REQUEST_HOST = 'https://api.sandbox.verisoul.ai';
const REQUEST_OPTIONS = {
  headers: {
    accept: 'application/json',
    'x-api-key': VERISOUL_CONFIG.VERISOUL_API_KEY,
  },
};

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
    walletAddress,
  }: {
    proof: VerisoulProviderProof;
    walletAddress: string;
  }): Promise<VerificationResult> {
    const { sessionId } = proof;

    const verifyUniquenessUrl = `${REQUEST_HOST}/liveness/verify-uniqueness`;
    const verifyUniquenessRes = await axios.post(
      verifyUniquenessUrl,
      {
        session_id: sessionId,
      },
      REQUEST_OPTIONS,
    );

    // verify uniqueness
    const { data: verifyUniquenessData } = verifyUniquenessRes;
    if (!verifyUniquenessData.success)
      return {
        success: false,
        message: 'Authentication with Verisoul failed!',
      };

    // if (verifyUniquenessData.matches?.length)
    //   return {
    //     success: false,
    //     message: 'Identity has been belong with another user!',
    //   };
    //
    // // enroll
    // const enrollUrl = `${REQUEST_HOST}/liveness/enroll`;
    // const enrollRes = await axios.post(
    //   enrollUrl,
    //   {
    //     session_id: sessionId,
    //     account_id: walletAddress,
    //   },
    //   REQUEST_OPTIONS,
    // );
    // const { data: enrollData } = enrollRes;
    // if (!enrollData.success)
    //   return {
    //     success: false,
    //     message: 'Authentication with Verisoul failed!',
    //   };

    const level = 1;
    const evidence = JSON.stringify(verifyUniquenessData);

    return {
      success: true,
      data: {
        evidence,
        level,
      },
    };
  }

  async getSession(): Promise<{ sessionId: string }> {
    const verisoulURL = `${REQUEST_HOST}/liveness/session`;
    const res = await axios.get(verisoulURL, REQUEST_OPTIONS);

    return {
      sessionId: res.data.session_id,
    };
  }
}
