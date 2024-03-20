import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestService } from 'src/app';

@Controller('/requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  async getList(
    @Headers('x-wallet-address') walletAddress: string,
    @Param('provider') provider: string,
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
}
