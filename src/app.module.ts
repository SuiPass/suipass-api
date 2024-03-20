import { Module } from '@nestjs/common';
import { RequestController } from './presentation';
import { ProviderService, RequestService } from './app/services';
import { ConfigModule } from '@nestjs/config';
import { DatabaseClient } from './infra';
import {
  GithubProvider,
  GoogleProvider,
  ProviderFactory,
  TwitterProvider,
} from './app';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [RequestController],
  providers: [
    DatabaseClient,

    // providers
    GithubProvider,
    GoogleProvider,
    TwitterProvider,
    ProviderFactory,

    // services
    RequestService,
    ProviderService,
  ],
})
export class AppModule {}
