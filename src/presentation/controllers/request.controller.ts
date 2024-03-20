import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestService } from 'src/app';
import { GithubService } from 'src/app/services/github.service';

@Controller('/requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly git: GithubService,
  ) { }

  @Get()
  async getList(
    @Headers('x-wallet-address') walletAddress: string,
    @Query('provider') provider: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    return this.requestService.getList({
      provider,
      walletAddress,
    });
  }

  @Post()
  async create(
    @Headers('x-wallet-address') walletAddress: string,
    @Body('provider') provider: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    return this.requestService.create({
      provider,
      walletAddress,
    });
  }

  // WARN: DEBUG
  @Post('/approve')
  async approve(@Body('address') address: string) {
    return this.git.consumeRequest(address);
  }
}
