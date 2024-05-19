import { ScoreUseCaseDto } from 'src/domain';
import { z } from 'zod';

// Create
export type ScoreUseCaseCreateInput = {
  name: string;
  description: string;
  providerIds: string[];
  order: number;
};
export type ScoreUseCaseCreateOutput = void;
export const ScoreUseCaseCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  providerIds: z.string().array(),
  order: z.number(),
});

// Update
export type ScoreUseCaseUpdateInput = {
  id: string;
  name?: string;
  description?: string;
  providerIds?: string[];
  order?: number;
};
export type ScoreUseCaseUpdateOutput = void;
export const ScoreUseCaseUpdateInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  providerIds: z.string().array().optional(),
  order: z.number().optional(),
});

// Delete
export type ScoreUseCaseDeleteInput = {
  id: string;
};
export type ScoreUseCaseDeleteOutput = void;

// GetList
export type ScoreUseCaseGetListInput = void;
export type ScoreUseCaseGetListOutput = ScoreUseCaseDto[];

// GetById
export type ScoreUseCaseGetByIdInput = {
  id: string;
};
export type ScoreUseCaseGetByIdOutput = ScoreUseCaseDto;
