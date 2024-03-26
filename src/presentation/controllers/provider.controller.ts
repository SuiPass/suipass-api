import { Controller, Get } from '@nestjs/common';
import { ProviderService } from 'src/app';

@Controller('/providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) { }

  @Get()
  async getList() {
    return this.providerService.getList();
  }
}
