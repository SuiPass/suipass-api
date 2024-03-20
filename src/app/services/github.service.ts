import { Injectable } from '@nestjs/common';
import { SUI_CONFIGS } from 'src/config';
import { SuiClient } from 'src/infra';

@Injectable()
export class GithubService {
  constructor(private readonly suiclient: SuiClient) { }
  async consumeRequest(addr: string) {
    await this.suiclient.approveRequest(SUI_CONFIGS.GITHUB_CAP, addr);
  }
}
