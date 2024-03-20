import { Module } from '@nestjs/common';
import { RequestController } from './presentation';
import { RequestService } from './app/services';
import { ConfigModule } from '@nestjs/config';
import { DatabaseClient, SuiClient } from './infra';
import { ListenerService } from './app/services/listener.service';
import { GithubService } from './app/services/github.service';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [RequestController],
  providers: [
    DatabaseClient,
    SuiClient,
    RequestService,
    ListenerService,
    GithubService,
  ],
})
export class AppModule { }
