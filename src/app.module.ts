import { Module } from '@nestjs/common';
import {
  ProviderController,
  RequestController,
  UserController,
} from './presentation';
import {
  ListenerService,
  ProviderService,
  RequestService,
  UserService,
} from './app/services';
import { ConfigModule } from '@nestjs/config';
import { DatabaseClient, SuiClient } from './infra';
import {
  GithubProvider,
  GoogleProvider,
  ProviderFactory,
  TwitterProvider,
  SuiProvider,
} from './app';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [RequestController, ProviderController, UserController],
  providers: [
    DatabaseClient,
    SuiClient,

    // providers
    GithubProvider,
    GoogleProvider,
    TwitterProvider,
    ProviderFactory,
    SuiProvider,

    // services
    UserService,
    RequestService,
    ProviderService,
    ListenerService,
  ],
})
export class AppModule {}
