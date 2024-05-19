import { BadRequestException, Injectable } from '@nestjs/common';
import { IDao } from 'src/base';
import { ScoreUseCaseDto } from 'src/domain';
import { DatabaseClient } from '../database';
import { COLLECTION_NAMES } from 'src/constants';

export interface IScoreUseCaseDao extends IDao<ScoreUseCaseDto> {}

@Injectable()
export class ScoreUseCaseDao implements IScoreUseCaseDao {
  constructor(private readonly db: DatabaseClient) {}

  async create(input: ScoreUseCaseDto): Promise<void> {
    const doc = this.db.client
      .collection(COLLECTION_NAMES.SCORE_USE_CASES)
      .doc();
    await doc.set(input);
  }

  async update(
    id: string | number,
    input: Partial<ScoreUseCaseDto>,
  ): Promise<void> {
    const res = await this.db.client
      .collection(COLLECTION_NAMES.SCORE_USE_CASES)
      .where('id', '==', id)
      .get();

    if (!res.docs[0])
      throw new BadRequestException(`Cannot find item has id ${id}`);

    await res.docs[0].ref.update(input);
  }

  async delete(id: string | number): Promise<void> {
    const res = await this.db.client
      .collection(COLLECTION_NAMES.SCORE_USE_CASES)
      .where('id', '==', id)
      .get();

    if (!res.docs[0])
      throw new BadRequestException(`Cannot find item has id ${id}`);

    await res.docs[0].ref.delete();
  }

  async find(): Promise<ScoreUseCaseDto[]> {
    const res = await this.db.client
      .collection(COLLECTION_NAMES.SCORE_USE_CASES)
      .orderBy('order')
      .get();
    const records = res.docs.map((doc) => doc.data() as ScoreUseCaseDto);
    return records;
  }

  async findById(id: string): Promise<ScoreUseCaseDto> {
    const res = await this.db.client
      .collection(COLLECTION_NAMES.SCORE_USE_CASES)
      .where('id', '==', id)
      .get();

    if (!res.docs[0])
      throw new BadRequestException(`Cannot find item has id ${id}`);

    const record = res.docs[0].data() as ScoreUseCaseDto;
    return record;
  }
}
