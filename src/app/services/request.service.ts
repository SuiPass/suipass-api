import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseClient } from 'src/infra';
import { ProviderFactory } from '../providers';
import { ProviderCodes } from 'src/domain';

@Injectable()
export class RequestService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly providerFactory: ProviderFactory,
  ) { }

  // TODO: should be call from the listener?
  async create({
    walletAddress,
    provider: providerCode,
    proof,
  }: {
    walletAddress: string;
    provider: string;
    proof: string;
  }): Promise<void> {
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

    const provider = this.providerFactory.get(
      ProviderCodes[providerCode as keyof typeof ProviderCodes],
    );

    provider.consumeRequest(walletAddress, proof);
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