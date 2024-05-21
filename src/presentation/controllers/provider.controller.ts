import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ProviderService } from 'src/app';

@Controller('/providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getList(@Headers('x-wallet-address') walletAddress: string) {
    const data = await this.providerService.getList(walletAddress);

    return data;
  }

  @Get('/verisoul/session')
  async getVerisoulSession(@Headers('x-wallet-address') walletAddress: string) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.providerService.verisoulGetSession();

    return data;
  }
}
