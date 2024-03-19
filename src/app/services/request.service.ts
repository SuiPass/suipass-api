import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseClient } from 'src/infra';

@Injectable()
export class RequestService {
  constructor(private readonly db: DatabaseClient) {}

  async create({
    walletAddress,
    provider,
  }: {
    walletAddress: string;
    provider: string;
  }): Promise<void> {
    const currentDoc = await this.db.client
      .collection('requests')
      .doc(walletAddress)
      .collection('items')
      .where('provider', '==', provider)
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
      provider,
      isApproved: false,
      createdAt: new Date(),
    };
    await newDoc.set(record);
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
