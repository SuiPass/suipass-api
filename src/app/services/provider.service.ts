import { Injectable } from '@nestjs/common';
import { ProviderCodes } from 'src/domain';
import {
  GithubProviderProof,
  GoogleProviderProof,
  ProviderFactory,
} from '../providers';

@Injectable()
export class ProviderService {
  constructor(private readonly providerFactory: ProviderFactory) { }

  async verify({
    providerCode,
    proof,
  }:
    | {
      providerCode: ProviderCodes;
      proof: never;
    }
    | {
      providerCode: ProviderCodes.GITHUB;
      proof: GithubProviderProof;
    }
    | {
      providerCode: ProviderCodes.GOOGLE;
      proof: GoogleProviderProof;
    }) {
    const provider = this.providerFactory.get(providerCode);

    const res = await provider.verify({ proof });

    return res;
  }
}
