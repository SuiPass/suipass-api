import { BadRequestException, Injectable } from '@nestjs/common';
import {
  getFullnodeUrl,
  SuiClient as Client,
  SuiTransactionBlockResponse,
} from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { SUI_CONFIG } from 'src/configs';

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

  async approveRequest(
    providerCap: string,
    requestId: string,
    evident: string,
    level: number,
  ) {
    const txb = new TransactionBlock();
    const func = 'suipass::resolve_request';

    txb.moveCall({
      arguments: [
        txb.object(providerCap),
        txb.object(SUI_CONFIG.SUIPASS_ADDR),
        txb.pure.address(requestId),
        txb.pure.string(evident),
        txb.pure.u16(level),
      ],
      target: `${SUI_CONFIG.PACKAGE_ADDR}::${func}`,
    });

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

  async getBalance(walletAddress: string): Promise<number> {
    const balance = await this.client.getBalance({
      owner: walletAddress,
      // coinType: 'SUI',
    });
    return Number(balance.totalBalance);
  }

  async getTransactionBlocks(walletAddress: string): Promise<any> {
    let hasNextPage = true;
    let nextCursor = undefined;
    const data = [];
    while (hasNextPage) {
      const res = await this.client.queryTransactionBlocks({
        cursor: nextCursor,
        filter: {
          ToAddress: walletAddress,
        },
        options: {
          showInput: true,
        },
      });
      hasNextPage = res.hasNextPage;
      nextCursor = res.nextCursor;
      data.push(res.data);
    }

    console.log('Debug txn blocks', JSON.stringify(data, null, 2));
    return data;
  }

  async getDepositTxnBlock(
    walletAddress: string,
  ): Promise<SuiTransactionBlockResponse> {
    const res = await this.client.queryTransactionBlocks({
      cursor: undefined,
      limit: 1,
      order: 'ascending',
      filter: {
        ToAddress: walletAddress,
      },
      options: {
        showInput: true,
      },
    });
    if (res.data.length === 0) {
      throw new BadRequestException(
        'This address did not receive deposit transaction yet',
      );
    }

    return res.data[0];
  }
}
