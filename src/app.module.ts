import { Module } from '@nestjs/common';
import { ProviderController, RequestController } from './presentation';
import { ProviderService, RequestService } from './app/services';
import { ConfigModule } from '@nestjs/config';
import { DatabaseClient, SuiClient } from './infra';
import { ListenerService } from './app/services/listener.service';
import {
  GithubProvider,
  GoogleProvider,
  ProviderFactory,
  TwitterProvider,
} from './app';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [RequestController, ProviderController],
  providers: [
    DatabaseClient,
    SuiClient,
    ListenerService,

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
export class AppModule { }
