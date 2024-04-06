import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseClient, SuiClient } from 'src/infra';
import { ProviderFactory } from '../providers';
import { parseProviderCode } from 'src/domain';

@Injectable()
export class RequestService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly providerFactory: ProviderFactory,
    private readonly suiclient: SuiClient,
  ) {}

  // TODO: should be call from the listener?
  async create({
    walletAddress,
    provider: providerCode,
    requestId,
    proof,
  }: {
    walletAddress: string;
    provider: string;
    requestId: string;
    proof: string;
  }): Promise<any> {
    const currentDoc = await this.db.client
      .collection('requests')
      .doc(walletAddress)
      .collection('items')
      .where('provider', '==', providerCode)
      .where('isApproved', '==', false)
      .limit(1)
      .get();

    if (currentDoc.docs.length)
      throw new BadRequestException('Request is exists!');

    console.log(
      'Create a request',
      JSON.stringify(
        {
          walletAddress,
          providerCode,
          requestId,
          proof,
        },
        null,
        2,
      ),
    );

    const newDoc = this.db.client
      .collection('requests')
      .doc(walletAddress)
      .collection('items')
      .doc();

    const record = {
      provider: providerCode,
      isApproved: false,
      createdAt: new Date(),
    };
    await newDoc.set(record);

    // Resolve request
    const provider = this.providerFactory.get(parseProviderCode(providerCode));

    const parsedProof = provider.parseProof(proof);

    const result = await provider.verify({ proof: parsedProof });

    if (result.success === true) {
      await this.suiclient.approveRequest(
        provider.cap,
        requestId,
        result.data.evidence,
        result.data.level,
      );
      await newDoc.update({ isApproved: true });
    } else {
      throw result.message;
    }
    return result;
  }

  async getList({
    walletAddress,
    provider,
  }: {
    walletAddress: string;
    provider: string;
  }): Promise<any[]> {
    const currentDoc = await this.db.client
      .collection('requests')
      .doc(walletAddress)
      .collection('items')
      .where('provider', '==', provider)
      .get();

    const records = currentDoc.docs.map((doc) => doc.data());

    return records;
  }
}
