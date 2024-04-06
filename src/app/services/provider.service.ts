import { Injectable } from '@nestjs/common';
import {
  ApprovalDto,
  ProviderCodes,
  ProviderDto,
  ProviderStatus,
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
  ) {}

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
      }
    | {
        providerCode: ProviderCodes.SUI;
        proof: TwitterProviderProof;
      }) {
    const provider = this.providerFactory.get(providerCode);

    const res = await provider.verify({ proof });

    return res;
  }

  async getList(walletAddress: string | undefined): Promise<ProviderDto[]> {
    const [providerRef, approvals, requests] = await Promise.all([
      this.db.client
        .collection('providers')
        .where('disabled', '!=', true)
        .get(),
      walletAddress ? this.userSvc.getApprovals(walletAddress) : undefined,
      walletAddress
        ? // TODO: move to DAO
          (async () => {
            const requestRef = await this.db.client
              .collection('requests')
              .doc(walletAddress)
              .collection('items')
              .get();
            return requestRef.docs.map((doc) => doc.data());
          })()
        : undefined,
    ]);

    const providersMap = new Map<string, ProviderDto>();
    providerRef.docs.forEach((doc) => {
      const raw = doc.data();
      const provider: ProviderDto = mapRawToProviderEntity(raw);
      providersMap.set(provider.id, provider);

      if (requests) {
        const providerCode = provider.name.toLowerCase();
        switch (true) {
          case !!requests.find(
            (request) =>
              request.provider === providerCode && request.isApproved,
          ):
            provider.status = ProviderStatus.VERIFIED;
            break;

          case !!requests.find(
            (request) =>
              request.provider === providerCode && !request.isApproved,
          ):
            provider.status = ProviderStatus.WAITING;
            break;

          default:
            provider.status = ProviderStatus.NOT_VERIFIED;
        }
      }
    });

    if (walletAddress) {
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
