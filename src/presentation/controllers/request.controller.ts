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
    @Body('requestId') _requestId: string,
    @Body('proof') proof: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = this.requestService.create({
      walletAddress,
      requestId: walletAddress, // HACK: should be set as requestId
      provider,
      proof,
    });
    return { data };
  }
}
