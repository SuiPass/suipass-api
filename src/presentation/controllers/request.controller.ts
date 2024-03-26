import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { RequestService } from 'src/app';

@Controller('/requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  async getList(
    @Headers('x-wallet-address') walletAddress: string,
    @Query('provider') provider: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.requestService.getList({
      provider,
      walletAddress,
    });

    return { data };
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
}
