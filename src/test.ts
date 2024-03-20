import { INestApplication } from '@nestjs/common';
import { ProviderService } from './app';
import { ProviderCodes } from './domain';

export async function test(app: INestApplication) {
  const providerService = app.get(ProviderService);

  await providerService
    .verify({
      providerCode: ProviderCodes.Github,
      proof: { authorizationCode: 'abc' },
    })
    .then((res) => console.info('github verify passed', res))
    .catch((err) => console.error('github verify failed', err));

  await providerService
    .verify({
      providerCode: ProviderCodes.Google,
      proof: { authorizationCode: 'abc' },
    })
    .then((res) => console.info('google verify passed', res))
    .catch((err) => console.error('google verify failed', err));
}
