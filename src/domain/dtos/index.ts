import { Approval } from '../contract';
import { ProviderEntity } from '../entity';

export * from './response.dto';

export type ApprovalDto = { score: number } & Approval;
export type ProviderDto = { approvals?: ApprovalDto[] } & ProviderEntity;
export type UserDetailDto = {
  address: string;
  approvals: ApprovalDto[];
  totalScore: number;
};
