export enum ProviderCodes {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  SUI = 'SUI',
  VERISOUL = 'VERISOUL',
  DISCORD = 'DISCORD',
  FACEBOOK = 'FACEBOOK',
  TEN = 'TEN',
}

export function parseProviderCode(raw: string): ProviderCodes {
  return ProviderCodes[raw.toUpperCase() as keyof typeof ProviderCodes];
}
