import { Injectable } from '@nestjs/common';
import { SUI_CONFIG } from 'src/configs';
import {
  ProviderEntity,
  UserDetail,
  mapRawToProviderEntity,
  mapToApproval,
} from 'src/domain';
import { DatabaseClient, SuiClient } from 'src/infra';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly sui: SuiClient,
  ) { }

  async getUserDetails(walletAddress: string): Promise<UserDetail> {
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

    const approvals = userObjects.data.map(mapToApproval);

    const ref = await this.db.client.collection('providers').get();

    const providersMap = new Map<string, ProviderEntity>();
    ref.docs.forEach((doc) => {
      const raw = doc.data();
      const provider = mapRawToProviderEntity(raw);
      providersMap.set(provider.id, provider);
    });

    let totalScore = 0;
    for (const approval of approvals) {
      const provider = providersMap.get(approval.provider);
      const score = (approval.level / provider.maxLevel) * provider.maxScore;
      totalScore += score;
    }

    return {
      address: walletAddress,
      approvals,
      totalScore,
    };
  }
}
