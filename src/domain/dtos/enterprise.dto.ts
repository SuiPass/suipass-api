import { ProviderEntity } from '../entity';

export type EnterpriseDetailDto = {
  name: string;
  metadata: string;
  providers: { [key: string]: ProviderEntity }; // Any
  threshold: number;
};
