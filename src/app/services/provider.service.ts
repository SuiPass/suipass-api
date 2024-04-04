import { Injectable } from '@nestjs/common';
import {
  ApprovalDto,
  ProviderCodes,
  ProviderDto,
  mapRawToProviderEntity,
} from 'src/domain';
import {
  GithubProviderProof,
  GoogleProviderProof,
  ProviderFactory,
  TwitterProviderProof,
} from '../providers';
import { DatabaseClient } from 'src/infra';
import { UserService } from './user.service';

@Injectable()
export class ProviderService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly providerFactory: ProviderFactory,
    private readonly userSvc: UserService,
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
      }
    | {
        providerCode: ProviderCodes.TWITTER;
        proof: TwitterProviderProof;
      }) {
    const provider = this.providerFactory.get(providerCode);

    const res = await provider.verify({ proof });

    return res;
  }

  async getList(walletAddress: string | undefined): Promise<ProviderDto[]> {
    const ref = await this.db.client.collection('providers').get();

    const providersMap = new Map<string, ProviderDto>();
    ref.docs.forEach((doc) => {
      const raw = doc.data();
      const provider = mapRawToProviderEntity(raw);
      providersMap.set(provider.id, provider);
    });

    if (walletAddress) {
      const approvals = await this.userSvc.getApprovals(walletAddress);
      for (const approval of approvals) {
        const provider = providersMap.get(approval.provider);
        const score = (approval.level / provider.maxLevel) * provider.maxScore;
        const approvalDto: ApprovalDto = { ...approval, score };
        provider.approvals = [approvalDto];
        providersMap.set(approval.provider, provider);
      }
    }

    return Array.from(providersMap.values());
  }
}
