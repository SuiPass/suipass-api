export enum ProviderCodes {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  SUI = 'SUI',
  VERISOUL = 'VERISOUL',
}

export function parseProviderCode(raw: string): ProviderCodes {
  return ProviderCodes[raw.toUpperCase() as keyof typeof ProviderCodes];
}
