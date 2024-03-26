import { Injectable, OnModuleInit } from '@nestjs/common';
import { SUI_CONFIG } from 'src/configs';
// import { SuiClient as Client, SuiHTTPTransport } from '@mysten/sui.js/client';
// import { WebSocket } from 'ws';
// import { SUI_CONFIG } from 'src/configs';
import { DatabaseClient, SuiClient } from 'src/infra';

@Injectable()
export class ListenerService implements OnModuleInit {
  constructor(
    private readonly db: DatabaseClient,
    private readonly suiclient: SuiClient,
  ) { }

  onModuleInit() {
    this.sync().then(() => {
      console.log('Data synced successfully');
      // this.startListener();
    });
  }

  // private async startListener() {
  //   const client = new SuiClient({
  //     transport: new SuiHTTPTransport({
  //       url: SUI_CONFIG.RPC_ENDPOINT,
  //       WebSocketConstructor: WebSocket as never,
  //       websocket: {
  //         reconnectTimeout: 1000,
  //         url: SUI_CONFIG.WSS_ENDPOINT,
  //       },
  //     }),
  //   });
  //
  //   const packageFilter = {
  //     Package: SUI_CONFIG.PACKAGE_ADDR,
  //   };
  //
  //   client.subscribeEvent({
  //     filter: packageFilter,
  //     onMessage(event) {
  //       console.log('Received an event:', event);
  //     },
  //   });
  // }

  private async sync() {
    const data = await this.suiclient.client.getObject({
      id: SUI_CONFIG.SUIPASS_ADDR,
      options: {
        showContent: true,
      },
    });
    console.log('Suipass', JSON.stringify(data, null, 2));
    const suipass = mapToSuipass(data);
    console.log('Suipass Parsed', JSON.stringify(mapToSuipass(data), null, 2));

    const providerDoc = this.db.client.collection('providers').doc();
    await providerDoc.set(suipass.providers.map(mapToProviderEntity).at(0));
  }
}

export type Suipass = {
  id: string;
  providers: Provider[];
  threshold: number;
  expirationPeriod: number;
};

export type Provider = {
  id: string;
  name: string;
  submitFee: string;
  updateFee: string;
  balance: number;
  totalLevels: number;
  score: number;
  records: Record[];
  requests: Request[];
};

export type ProviderEntity = {
  id: string;
  name: string;
  submitFee: string;
  updateFee: string;
  balance: number;
  totalLevels: number;
  score: number;
};

function mapToProviderEntity(provider: Provider): ProviderEntity {
  return {
    id: provider.id,
    name: provider.name,
    submitFee: provider.submitFee,
    updateFee: provider.updateFee,
    balance: provider.balance,
    totalLevels: provider.totalLevels,
    score: provider.score,
  };
}

export type Record = {
  requester: string;
  level: number;
  evidence: string;
};

export type Request = {
  id: string;
  requester: string;
  proof: string;
};

function mapToSuipass(raw: any): Suipass {
  const { id, expiration_period, providers, threshold } =
    raw.data.content.fields;
  return {
    id: id.id,
    providers: mapToListProviders(providers),
    threshold,
    expirationPeriod: expiration_period,
  };
}

function mapToListProviders(raw: any): Provider[] {
  return raw.fields.contents.map((p: any) => mapToProvider(p));
}

function mapToProvider(raw: any): Provider {
  const {
    id,
    name,
    submit_fee,
    update_fee,
    balance,
    max_level,
    max_score,
    records,
    requests,
  } = raw.fields.value.fields;
  return {
    id: id.id,
    name,
    submitFee: submit_fee,
    updateFee: update_fee,
    balance,
    totalLevels: max_level,
    score: max_score,
    records: records.fields.contents.map((val: any): Record => {
      const {
        key,
        value: {
          fields: { evidence, level },
        },
      } = val.fields;
      return {
        requester: key,
        level,
        evidence,
      };
    }),
    requests: requests.fields.contents.map((val: any): Request => {
      const {
        key,
        value: {
          fields: { requester, proof },
        },
      } = val.fields;

      return {
        id: key,
        requester,
        proof,
      };
    }),
  };
}
