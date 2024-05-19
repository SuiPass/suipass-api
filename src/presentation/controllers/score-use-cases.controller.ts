import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ScoreUseCaseService } from 'src/app';

@Controller('/score-use-cases')
export class ScoreUseCaseController {
  constructor(private readonly scoreUseCaseService: ScoreUseCaseService) {}

  @Post()
  async create(
    @Headers('x-wallet-address') walletAddress: string,
    @Body() body: any,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.scoreUseCaseService.create(body);

    return data;
  }

  @Patch('/:id')
  async update(
    @Headers('x-wallet-address') walletAddress: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.scoreUseCaseService.update({
      ...body,
      id,
    });

    return data;
  }

  @Delete('/:id')
  async delete(
    @Headers('x-wallet-address') walletAddress: string,
    @Param('id') id: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.scoreUseCaseService.delete({ id });

    return data;
  }

  @Get()
  async getList(@Headers('x-wallet-address') walletAddress: string) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.scoreUseCaseService.getList();

    return data;
  }

  @Get('/:id')
  async getById(
    @Headers('x-wallet-address') walletAddress: string,
    @Param('id') id: string,
  ) {
    if (!walletAddress) throw new UnauthorizedException();

    const data = await this.scoreUseCaseService.getById({ id });

    return data;
  }
}
