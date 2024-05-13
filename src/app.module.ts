import { Module } from '@nestjs/common';
import {
  ProviderController,
  RequestController,
  UserController,
  EnterpriseController
} from './presentation';
import {
  ListenerService,
  ProviderService,
  RequestService,
  UserService,
  EnterpriseService,
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
  controllers: [RequestController, ProviderController, UserController, EnterpriseController],
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
    EnterpriseService
  ],
})
export class AppModule { }
