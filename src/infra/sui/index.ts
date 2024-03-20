import { Injectable } from '@nestjs/common';
import { getFullnodeUrl, SuiClient as Client } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_CONFIGS } from 'src/config';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

@Injectable()
export class SuiClient {
  private _client: Client;
  get client() {
    if (!this._client)
      this._client = new Client({ url: getFullnodeUrl('testnet') });

    return this._client;
  }

  fromHexStrin(hexString: string): Uint8Array {
    return Uint8Array.from(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
    );
  }

  async approveRequest(providerCap: string, address: string) {
    const txb = new TransactionBlock();
    const func = 'suipass::resolve_request';

    txb.moveCall({
      arguments: [
        txb.object(providerCap),
        txb.object(SUI_CONFIGS.SUIPASS_ADDR),
        txb.pure.address(address),
        txb.pure.string('hello'),
        txb.pure.u16(1),
      ],
      target: `${SUI_CONFIGS.PACKAGE_ADDR}::${func}`,
    });
    console.log('payload', [
      txb.object(providerCap),
      txb.object(SUI_CONFIGS.SUIPASS_ADDR),
      txb.pure.address(address),
      txb.pure.string('hello'),
      txb.pure.u16(1),
    ]);

    const keypair = Ed25519Keypair.fromSecretKey(
      this.fromHexStrin(
        '88244152565302ef266c236a0ac328a62faf82257b1ff4641c66ed9e8ee40210',
      ),
    );
    const result = await this.client.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      signer: keypair,
      requestType: 'WaitForLocalExecution',
      options: {
        showEffects: true,
      },
    });
    return result;
  }
}
