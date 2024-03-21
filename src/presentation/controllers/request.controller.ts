import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { GithubProvider, RequestService } from 'src/app';

@Controller('/requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly git: GithubProvider,
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
    @Body('proof') proof: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    return this.requestService.create({
      walletAddress,
      provider,
      proof,
    });
  }

  // WARN: DEBUG
  @Post('/approve')
  async approve(
    @Body('address') address: string,
    @Body('proof') proof: string,
  ) {
    return this.git.consumeRequest(address, proof);
  }
}
