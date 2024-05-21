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
  SuiProviderProof,
} from '../providers';
import { DatabaseClient } from 'src/infra';
import { UserService } from './user.service';
import { request } from 'http';

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
        proof: SuiProviderProof;
      }) {
    const provider = this.providerFactory.get(providerCode);

    const res = await provider.verify({ proof: proof as any }); // HACK: Should remove `as any`

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

      if (walletAddress) {
        // sort approvals by level desc, issuedDate desc
        const approvalsOfProvider = approvals
          .filter((approval) => approval.provider === provider.id)
          .map((approval) => {
            const provider = providersMap.get(approval.provider);
            const score =
              (approval.level / provider.maxLevel) * provider.maxScore;
            const approvalDto: ApprovalDto = { ...approval, score };
            return approvalDto;
          })
          .sort((a, b) => (a.issuedDate < b.issuedDate ? 1 : -1))
          .sort((a, b) => (a.level < b.level ? 1 : -1));

        provider.approvals = approvalsOfProvider;
      }

      if (requests) {
        const providerCode = provider.name.toLowerCase();
        const requestsOfProvider = requests.filter(
          (request) => request.provider === providerCode,
        );

        switch (true) {
          case !!requestsOfProvider.find((request) => request.isApproved) &&
            provider.approvals![0].score > 0:
            provider.status = ProviderStatus.VERIFIED;
            break;

          case !!requestsOfProvider.find(
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

    return Array.from(providersMap.values());
  }

  async verisoulGetSession(): Promise<{ sessionId: string }> {
    const provider = this.providerFactory.get(ProviderCodes.VERISOUL);
    return provider.getSession();
  }
}
