export type ScoreUseCaseDto = {
  id: string;
  name: string;
  description: string;
  providerIds: string[];
  order: number;
  thumbnailUrl?: string;
};
