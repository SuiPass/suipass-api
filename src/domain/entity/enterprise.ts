import { Level } from '../contract';

export type EnterpriseEntity = {
  name: string;
  desc: string;
  providerIds: string[];
};

export type UserApiKeyEntity = {
  name: string;
  desc: string;
  providerIds: string[];
  apiKey: string; //TODO: Sui module key or whatever, i'm not sure
}
