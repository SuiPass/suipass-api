import { Module } from '@nestjs/common';
import {
  ProviderController,
  RequestController,
  UserController,
  EnterpriseController,
  ScoreUseCaseController,
} from './presentation';
import {
  ListenerService,
  ProviderService,
  RequestService,
  UserService,
  EnterpriseService,
  ScoreUseCaseService,
} from './app/services';
import { ConfigModule } from '@nestjs/config';
import { DatabaseClient, ScoreUseCaseDao, SuiClient } from './infra';
import {
  GithubProvider,
  GoogleProvider,
  ProviderFactory,
  TwitterProvider,
  SuiProvider,
  VerisoulProvider,
} from './app';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [
    RequestController,
    ProviderController,
    UserController,
    EnterpriseController,
    ScoreUseCaseController,
  ],
  providers: [
    DatabaseClient,
    SuiClient,

    // daos
    ScoreUseCaseDao,

    // providers
    GithubProvider,
    GoogleProvider,
    TwitterProvider,
    ProviderFactory,
    SuiProvider,
    VerisoulProvider,

    // services
    UserService,
    RequestService,
    ProviderService,
    ListenerService,
    EnterpriseService,
    ScoreUseCaseService,
  ],
})
export class AppModule {}
