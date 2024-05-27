import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from 'src/app';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/detail')
  async getList(
    @Headers('x-wallet-address') walletAddress: string,
    @Headers('x-enterprise-address') enterpriseAddress: string,
  ) {
    const data = await this.userService.getUserDetails(
      walletAddress,
      enterpriseAddress,
    );
    return data;
  }
}
