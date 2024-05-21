import { IProvider, ProviderCodes } from 'src/domain';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubProvider } from './github-provider';
import { GoogleProvider } from './google-provider';
import { TwitterProvider } from './twitter-provider';
import { SuiProvider } from './sui-provider';
import { VerisoulProvider } from './verisoul-provider';

type GetProviderOutput<T> = T extends ProviderCodes.GITHUB
  ? GithubProvider
  : T extends ProviderCodes.GOOGLE
    ? GoogleProvider
    : T extends ProviderCodes.TWITTER
      ? TwitterProvider
      : T extends ProviderCodes.SUI
        ? SuiProvider
        : T extends ProviderCodes.VERISOUL
          ? VerisoulProvider
          : IProvider<any>;

@Injectable()
export class ProviderFactory {
  constructor(
    private readonly githubProvider: GithubProvider,
    private readonly googleProvider: GoogleProvider,
    private readonly twitterProvider: TwitterProvider,
    private readonly suiProvider: SuiProvider,
    private readonly verisoulProvider: VerisoulProvider,
  ) {}

  get<T extends ProviderCodes>(providerCode: T): GetProviderOutput<T> {
    switch (providerCode) {
      case ProviderCodes.GITHUB:
        return this.githubProvider as GetProviderOutput<T>;

      case ProviderCodes.GOOGLE:
        return this.googleProvider as GetProviderOutput<T>;

      case ProviderCodes.TWITTER:
        return this.twitterProvider as GetProviderOutput<T>;

      case ProviderCodes.SUI:
        return this.suiProvider as GetProviderOutput<T>;

      case ProviderCodes.SUI:
        return this.suiProvider as GetProviderOutput<T>;

      case ProviderCodes.VERISOUL:
        return this.verisoulProvider as GetProviderOutput<T>;

      default:
        throw new BadRequestException(`Provider don't support!`);
    }
  }
}
