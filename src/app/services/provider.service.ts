import { Injectable } from '@nestjs/common';
import {
  ProviderCodes,
  ProviderEntity,
  mapRawToProviderEntity,
} from 'src/domain';
import {
  GithubProviderProof,
  GoogleProviderProof,
  ProviderFactory,
} from '../providers';
import { DatabaseClient } from 'src/infra';

@Injectable()
export class ProviderService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly providerFactory: ProviderFactory,
  ) { }

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

  async getList(): Promise<ProviderEntity[]> {
    const ref = await this.db.client.collection('providers').get();

    const providers = ref.docs.map((doc) => {
      const raw = doc.data();
      return mapRawToProviderEntity(raw);
    });

    return providers;
  }
}
