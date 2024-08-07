import { INestApplication } from '@nestjs/common';
import { ProviderService } from './app';
import { ProviderCodes } from './domain';

export async function test(app: INestApplication) {
  const providerService = app.get(ProviderService);

  await providerService
    .verify({
      providerCode: ProviderCodes.GITHUB,
      proof: { authorizationCode: 'abc' },
      walletAddress: '',
    })
    .then((res) => console.info('github verify passed', res))
    .catch((err) => console.error('github verify failed', err));

  await providerService
    .verify({
      providerCode: ProviderCodes.GOOGLE,
      proof: { authorizationCode: 'abc' },
      walletAddress: '',
    })
    .then((res) => console.info('google verify passed', res))
    .catch((err) => console.error('google verify failed', err));

  await providerService
    .verify({
      providerCode: ProviderCodes.SUI,
      proof: {
        walletAddress:
          '0xcaf04a98b6be9872ef08a4279c2a148470338d1543cb63cdabe46a093cb88623',
      },
      walletAddress: '',
    })
    .then((res) => console.info('sui verify passed', res))
    .catch((err) => console.error('sui verify failed', err));

  await providerService
    .verify({
      providerCode: ProviderCodes.TEN,
      proof: {},
      walletAddress: '',
    })
    .then((res) => console.info('ten verify passed', res))
    .catch((err) => console.error('ten verify failed', err));

  // await providerService
  //   .verify({
  //     providerCode: ProviderCodes.TWITTER,
  //     proof: {
  //       authorizationCode:
  //         'dEhuNWVzMWlDLU9sMEFmVU54NjRpTk5Sc2dyMUtKaXlqYk1ydHdneWctSzhnOjE3MTE5OTkxMzMzMzI6MTowOmFjOjE',
  //     },
  //   })
  //   .then((res) => console.info('twitter verify passed', res))
  //   .catch((err) => console.error('twitter verify failed', err));
}
