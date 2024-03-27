import { Injectable, OnModuleInit } from '@nestjs/common';
import { SUI_CONFIG } from 'src/configs';
import { mapToProviderEntity, mapToSuipass } from 'src/domain/mapper';
import { DatabaseClient, SuiClient } from 'src/infra';
import { SuiClient as Client, SuiHTTPTransport } from '@mysten/sui.js/client';
import { WebSocket } from 'ws';

@Injectable()
export class ListenerService implements OnModuleInit {
  constructor(
    private readonly db: DatabaseClient,
    private readonly suiclient: SuiClient,
  ) {}

  onModuleInit() {
    this.sync().then(() => {
      console.log('Data synced successfully');
      // this.startListener();
    });
  }

  // NOTE: Unused function
  private async startListener() {
    const client = new Client({
      transport: new SuiHTTPTransport({
        url: SUI_CONFIG.PRIV_RPC,
        WebSocketConstructor: WebSocket as never,
        websocket: {
          reconnectTimeout: 1000,
          url: SUI_CONFIG.PRIV_WSS,
        },
      }),
    });

    const packageFilter = {
      Package: SUI_CONFIG.PACKAGE_ADDR,
    };

    client.subscribeEvent({
      filter: packageFilter,
      onMessage(event) {
        console.log('Received an event:', event);
      },
    });
  }

  private async sync() {
    const data = await this.suiclient.client.getObject({
      id: SUI_CONFIG.SUIPASS_ADDR,
      options: {
        showContent: true,
      },
    });
    const suipass = mapToSuipass(data);
    const providerCollectionRef = this.db.client.collection('providers');

    for (const provider of suipass.providers) {
      const entity = mapToProviderEntity(provider);
      await providerCollectionRef.doc(entity.id).set(entity, { merge: true });
    }
  }
}
