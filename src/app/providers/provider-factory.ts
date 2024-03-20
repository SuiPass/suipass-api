import { IProvider, ProviderCodes } from 'src/domain';
import { GithubProvider } from './github-provider';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleProvider } from './google-provider';
import { TwitterProvider } from './twitter-provider';

type GetProviderOutput<T> = T extends ProviderCodes.Github
  ? GithubProvider
  : T extends ProviderCodes.Google
    ? GoogleProvider
    : T extends ProviderCodes.Twitter
      ? TwitterProvider
      : IProvider<any>;

@Injectable()
export class ProviderFactory {
  constructor(
    private readonly githubProvider: GithubProvider,
    private readonly googleProvider: GoogleProvider,
    private readonly twitterProvider: TwitterProvider,
  ) {}

  get<T extends ProviderCodes>(providerCode: T): GetProviderOutput<T> {
    switch (providerCode) {
      case ProviderCodes.Github:
        return this.githubProvider as GetProviderOutput<T>;

      case ProviderCodes.Google:
        return this.googleProvider as GetProviderOutput<T>;

      case ProviderCodes.Twitter:
        return this.twitterProvider as GetProviderOutput<T>;

      default:
        throw new BadRequestException(`Provider don't support!`);
    }
  }
}
