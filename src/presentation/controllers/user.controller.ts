import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from 'src/app';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/detail')
  async getList(@Headers('x-wallet-address') walletAddress: string) {
    const data = await this.userService.getUserDetails(walletAddress);
    return data;
  }
}
