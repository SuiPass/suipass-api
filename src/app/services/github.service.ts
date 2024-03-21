import { Injectable } from '@nestjs/common';
import { GITHUB_CONFIG } from 'src/configs';
import { SuiClient } from 'src/infra';

@Injectable()
export class GithubService {
  constructor(private readonly suiclient: SuiClient) { }
  async consumeRequest(addr: string) {
    await this.suiclient.approveRequest(GITHUB_CONFIG.GITHUB_CAP, addr);
  }
}
