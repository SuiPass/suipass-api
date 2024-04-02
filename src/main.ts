import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { test } from './test';
import { HttpExceptionFilter, InternalServerFilter } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isDevelopment = process.env.NODE_ENV === 'development';

  app.useGlobalFilters(new InternalServerFilter(), new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const adminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  app.enableCors();

  if (isDevelopment) {
    test(app);
  }

  await app.listen(3001);
}
bootstrap();
