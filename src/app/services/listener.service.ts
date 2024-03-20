import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  getFullnodeUrl,
  SuiClient,
  SuiHTTPTransport,
} from '@mysten/sui.js/client';
import { WebSocket } from 'ws';

@Injectable()
export class ListenerService implements OnModuleInit {
  onModuleInit() {
    // this.startListener();
  }

  // TODO: listen event to add request to database
  private async startListener() {
    const client = new SuiClient({
      transport: new SuiHTTPTransport({
        url: 'https://fullnode.testnet.sui.io:443',
        WebSocketConstructor: WebSocket as never,
        websocket: {
          reconnectTimeout: 1000,
          url: 'wss://rpc.testnet.sui.io:443',
        },
      }),
    });

    const suipass =
      '0x2ee0ff8227725610eb9af72c8df358709277c4457c59b3ac67187ab549aa0d92';
    const packageFilter = {
      Package: suipass,
    };

    client.subscribeEvent({
      filter: packageFilter,
      onMessage(event) {
        console.log(event);
      },
    });
  }
}
