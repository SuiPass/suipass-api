import { Controller, Get, Headers } from '@nestjs/common';
import { ProviderService } from 'src/app';

@Controller('/providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) { }

  @Get()
  async getList(@Headers('x-wallet-address') walletAddress: string) {
    const data = await this.providerService.getList(walletAddress);

    return data;
  }
}
