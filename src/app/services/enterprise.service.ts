import { Injectable } from '@nestjs/common';
import {
  EnterpriseDetailDto,
  EnterpriseDto,
  UserApiKeyDto,
  mapRawToEnterpriseEntity,
  mapRawToUserApiKeyEntity,
} from 'src/domain';
import { SuiClient } from 'src/infra';
import {
  EnterpriseContractDto,
  ProviderConfigContractDto,
} from 'src/domain/contract/enterprise';
import { ProviderService } from './provider.service';

@Injectable()
export class EnterpriseService {
  constructor(
    private readonly sui: SuiClient,
    private readonly providerSvc: ProviderService,
  ) {}

  // async verify({
  //   providerCode,
  //   proof,
  // }:
  //   | {
  //     providerCode: ProviderCodes;
  //     proof: never;
  //   }
  //   | {
  //     providerCode: ProviderCodes.GITHUB;
  //     proof: GithubProviderProof;
  //   }
  //   | {
  //     providerCode: ProviderCodes.GOOGLE;
  //     proof: GoogleProviderProof;
  //   }
  //   | {
  //     providerCode: ProviderCodes.TWITTER;
  //     proof: TwitterProviderProof;
  //   }
  //   | {
  //     providerCode: ProviderCodes.SUI;
  //     proof: SuiProviderProof;
  //   }) {
  //   const provider = this.providerFactory.get(providerCode);
  //
  //   const res = await provider.verify({ proof: proof as any }); // HACK: Should remove `as any`
  //
  //   return res;
  // }

  getList(walletAddress: string | undefined): EnterpriseDto[] {
    const data = [
      {
        name: 'Airdrop Protection',
        desc: 'I want to ensure my airdrop goes to real humans and not farmers.',
        providerIds: [
          '0x168b1502b047d7e77f83da38e99b1a4081feedce79cc27d4e9c19a15ebf9a6ea',
          '0x50581dae10313e3460821fe0d9f4a3929c25a82a88974e6ec28af8b901683b3a',
        ],
      },
      {
        name: 'Sybil Prevention',
        desc: 'I need to ensure my community or app is not attacked.',
        providerIds: [
          '0x9cb483e777bd2e7f27a4cc16bca39448c7bda743c53794a8116d6141e8e090eb',
          '0x50581dae10313e3460821fe0d9f4a3929c25a82a88974e6ec28af8b901683b3a',
        ],
      },
      {
        name: 'Bot prevention',
        desc: 'I want my community or app to be safe from bots',
        providerIds: [
          '0xe9f29c68c836590e76b8219ef1d1722b806f1c5beeb25954c8053ab1e6974a6a',
          '0x50581dae10313e3460821fe0d9f4a3929c25a82a88974e6ec28af8b901683b3a',
        ],
      },
      {
        name: 'Customizable',
        desc: "It's something else",
        providerIds: [],
      },
    ];
    data.forEach((item) => {
      const enterprise: EnterpriseDto = mapRawToEnterpriseEntity(item);
      return enterprise;
    });
    return data;
  }

  getUserApiKeys(walletAddress: string | undefined): UserApiKeyDto[] {
    const data = [
      {
        name: 'secure rawbots dashboard',
        desc: 'this api will be using for rep.run dashboard.',
        providerIds: [
          '0x168b1502b047d7e77f83da38e99b1a4081feedce79cc27d4e9c19a15ebf9a6ea',
          '0x50581dae10313e3460821fe0d9f4a3929c25a82a88974e6ec28af8b901683b3a',
        ],
        apiKey:
          '0x168b1502b047d7e77f83da38e99b1a4081feedce79cc27d4e9c19a15ebf9a6ea',
      },
      {
        name: 'secure facebook.com',
        desc: 'this api will be using for facebook.com.',
        providerIds: [
          '0x168b1502b047d7e77f83da38e99b1a4081feedce79cc27d4e9c19a15ebf9a6ea',
          '0x50581dae10313e3460821fe0d9f4a3929c25a82a88974e6ec28af8b901683b3a',
        ],
        apiKey:
          '0x50581dae10313e3460821fe0d9f4a3929c25a82a88974e6ec28af8b901683b3a',
      },
    ];
    data.forEach((item) => {
      const userApiKey: UserApiKeyDto = mapRawToUserApiKeyEntity(item);
      return userApiKey;
    });
    return data;
  }

  async getById(id: string): Promise<EnterpriseContractDto> {
    const res = await this.sui.client.getObject({
      id,
      options: { showContent: true, showOwner: true },
    });
    const ent = mapToEnterpriseContractDto(res);
    return ent;
  }

  async getDetailById(id: string): Promise<EnterpriseDetailDto> {
    const res = await this.sui.client.getObject({
      id,
      options: { showContent: true, showOwner: true },
    });
    const ent = mapToEnterpriseContractDto(res) as any;
    for (const key in ent.providers) {
      if (ent.providers.hasOwnProperty(key)) {
        ent.providers.key = this.providerSvc.getById(key);
      }
    }
    return ent;
  }
}

function mapToEnterpriseContractDto(raw: any): EnterpriseContractDto {
  const content = raw.data.content;
  if (content.dataType === 'package') throw 'Invalid enterprise address';
  const {
    id: { id },
    name,
    metadata,
    providers,
    threshold,
  } = content.fields;
  const providersConfig: { [key: string]: ProviderConfigContractDto } = {};
  providers.fields.contents.forEach((v: any) => {
    const {
      key,
      value: {
        fields: { dummy_field },
      },
    } = v.fields;
    console.log(key, dummy_field);
    providersConfig[key] = { dummyField: dummy_field };
  });

  return {
    id,
    name,
    metadata,
    providers: providersConfig,
    threshold,
  };
}
