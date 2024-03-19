import { Module } from '@nestjs/common';
import { RequestController } from './presentation';
import { RequestService } from './app/services';
import { ConfigModule } from '@nestjs/config';
import { DatabaseClient } from './infra';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [RequestController],
  providers: [DatabaseClient, RequestService],
})
export class AppModule {}
