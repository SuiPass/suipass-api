import { Injectable } from '@nestjs/common';
import { SUI_CONFIG } from 'src/configs';
import {
  Approval,
  ApprovalDto,
  UserDetailDto,
  mapToApproval,
} from 'src/domain';
import { DatabaseClient, SuiClient } from 'src/infra';
import { EnterpriseService } from './enterprise.service';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly sui: SuiClient,
    private readonly entSvc: EnterpriseService,
  ) {}

  async getApprovals(walletAddress: string): Promise<Approval[]> {
    const userObjects = await this.sui.client.getOwnedObjects({
      owner: walletAddress,
      filter: {
        MatchAll: [
          { Package: SUI_CONFIG.ORIGINAL_PACKAGE_ADDR },
          {
            MatchAny: [
              {
                StructType: `${SUI_CONFIG.ORIGINAL_PACKAGE_ADDR}::approval::Approval`,
              },
              // TODO: Calculate the approval merged into User object also
              // {
              //   StructType: `${SUI_CONFIG.ORIGINAL_PACKAGE_ADDR}::user::User`,
              // },
            ],
          },
        ],
      },
      options: {
        showContent: true,
      },
    });

    return userObjects.data.map(mapToApproval);
  }

  async getUserDetails(
    walletAddress: string,
    enterpriseAddress: string = null,
  ): Promise<UserDetailDto> {
    const approvals = await this.getApprovals(walletAddress);
    const ref = await this.db.client.collection('providers').get();
    const currentApprovals: ApprovalDto[] = [];
    let totalScore = 0;
    let isValid = false;
    const ent =
      enterpriseAddress !== null
        ? await this.entSvc.getById(enterpriseAddress)
        : null;

    ref.docs.forEach((doc) => {
      const provider = doc.data();
      if (ent !== null && !ent.providers.has(provider.id)) return;
      // sort approvals by level desc, issuedDate desc
      const approvalsOfProvider = approvals
        .filter((approval) => approval.provider === provider.id)
        .map((approval) => {
          const score =
            (approval.level / provider.maxLevel) * provider.maxScore;
          const approvalDto: ApprovalDto = { ...approval, score };
          return approvalDto;
        })
        .sort((a, b) => (a.issuedDate < b.issuedDate ? 1 : -1))
        .sort((a, b) => (a.level < b.level ? 1 : -1));

      if (approvalsOfProvider.length) {
        const currentApproval = approvalsOfProvider[0];
        const score =
          (currentApproval.level / provider.maxLevel) * provider.maxScore;

        totalScore += score;

        currentApprovals.push({
          ...currentApproval,
          score,
        });
      }
    });

    if (ent !== null) {
      isValid = totalScore >= ent.threshold;
    } else {
      isValid = totalScore >= 400;
    }

    return {
      address: walletAddress,
      approvals: currentApprovals,
      totalScore,
      isValid,
    };
  }
}
