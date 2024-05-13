import { Approval } from '../contract';
import { ProviderEntity } from '../entity';

export * from './response.dto';

export type ApprovalDto = { score: number } & Approval;
export type ProviderDto = {
  approvals?: ApprovalDto[];
  status?: ProviderStatus;
} & ProviderEntity;

export type UserDetailDto = {
  address: string;
  approvals: ApprovalDto[];
  totalScore: number;
};
export type EnterpriseDto = {
  name: string;
  desc: string;
  providerIds: string[];
};

export type UserApiKeyDto = {
  name: string;
  desc: string;
  providerIds: string[];
  apiKey: string; //TODO: Sui module key or whatever, i'm not sure
}
export enum ProviderStatus {
  NOT_VERIFIED = 'not_verified',
  WAITING = 'waiting',
  VERIFIED = 'verified',
}
