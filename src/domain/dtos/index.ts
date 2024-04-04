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
export enum ProviderStatus {
  NOT_VERIFIED = 'not_verified',
  WAITING = 'waiting',
  VERIFIED = 'verified',
}
