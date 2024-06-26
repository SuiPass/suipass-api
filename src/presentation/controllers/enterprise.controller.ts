import { Controller, Get, Headers, Param } from '@nestjs/common';
import { EnterpriseService } from 'src/app';

@Controller('/enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get()
  async getList(@Headers('x-wallet-address') walletAddress: string) {
    const data = this.enterpriseService.getList(walletAddress);
    return data;
  }

  @Get(':id')
  async getById(@Param() params: any) {
    const data = this.enterpriseService.getDetailById(params.id);
    return data;
  }

  @Get('/api-keys')
  async getUserApiKeys(@Headers('x-wallet-address') walletAddress: string) {
    const data = this.enterpriseService.getUserApiKeys(walletAddress);
    return data;
  }
}
