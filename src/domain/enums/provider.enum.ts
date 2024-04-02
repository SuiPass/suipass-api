export enum ProviderCodes {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
}

export function parseProviderCode(raw: string): ProviderCodes {
  return ProviderCodes[raw.toUpperCase() as keyof typeof ProviderCodes];
}
