import { Injectable } from '@nestjs/common';
import { ScoreUseCaseDao } from 'src/infra';
import {
  ScoreUseCaseCreateInput,
  ScoreUseCaseCreateInputSchema,
  ScoreUseCaseCreateOutput,
  ScoreUseCaseDeleteInput,
  ScoreUseCaseDeleteOutput,
  ScoreUseCaseGetByIdInput,
  ScoreUseCaseGetByIdOutput,
  ScoreUseCaseGetListInput,
  ScoreUseCaseGetListOutput,
  ScoreUseCaseUpdateInput,
  ScoreUseCaseUpdateInputSchema,
  ScoreUseCaseUpdateOutput,
} from './score-use-case.types';

@Injectable()
export class ScoreUseCaseService {
  constructor(private readonly scoreUseCaseDao: ScoreUseCaseDao) {}

  async create(
    input: ScoreUseCaseCreateInput,
  ): Promise<ScoreUseCaseCreateOutput> {
    // Using Zod to validate database
    const model = ScoreUseCaseCreateInputSchema.parse(
      input,
    ) as ScoreUseCaseCreateInput; // as type to by pass "strictNullChecks": false

    // Using Dao to persit data into database
    await this.scoreUseCaseDao.create({
      ...model,
      id: crypto.randomUUID(),
    });

    return;
  }

  async update(
    input: ScoreUseCaseUpdateInput,
  ): Promise<ScoreUseCaseUpdateOutput> {
    // Using Zod to validate database
    const model = ScoreUseCaseUpdateInputSchema.parse(
      input,
    ) as ScoreUseCaseUpdateInput;

    await this.scoreUseCaseDao.update(model.id, model);

    return;
  }

  async delete(
    input: ScoreUseCaseDeleteInput,
  ): Promise<ScoreUseCaseDeleteOutput> {
    await this.scoreUseCaseDao.delete(input.id);

    return;
  }

  async getList(
    input: ScoreUseCaseGetListInput,
  ): Promise<ScoreUseCaseGetListOutput> {
    const dtos = await this.scoreUseCaseDao.find();

    return dtos;
  }

  async getById(
    input: ScoreUseCaseGetByIdInput,
  ): Promise<ScoreUseCaseGetByIdOutput> {
    const dtos = await this.scoreUseCaseDao.findById(input.id);

    return dtos;
  }
}
