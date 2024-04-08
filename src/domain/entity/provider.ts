import { Level } from '../contract';

export type ProviderEntity = {
  id: string;
  name: string;
  desc: string;
  logoUrl: string;
  levels: Level[];
  submitFee: string;
  updateFee: string;
  balance: number;
  maxLevel: number;
  maxScore: number;
  disabled: boolean;
};
