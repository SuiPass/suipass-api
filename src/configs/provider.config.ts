export const GITHUB_CONFIG = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_CAP: process.env.GITHUB_CAP,
  GITHUB_PROVIDER_ID: process.env.GITHUB_PROVIDER_ID,
} as const;

export const GOOGLE_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI ??
    'https://suipass.xyz?suipassProvider=google',
  GOOGLE_OWNER: process.env.GOOGLE_OWNER,
  GOOGLE_CAP: process.env.GOOGLE_CAP,
  GOOGLE_PROVIDER_ID: process.env.GOOGLE_PROVIDER_ID,
} as const;

export const TWITTER_CONFIG = {
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  TWITTER_REDIRECT_URI:
    process.env.TWITTER_REDIRECT_URI ??
    'https://suipass.xyz?suipassProvider=twitter',
  TWITTER_OWNER: process.env.TWITTER_OWNER,
  TWITTER_CAP: process.env.TWITTER_CAP,
  TWITTER_PROVIDER_ID: process.env.TWITTER_PROVIDER_ID,
} as const;

export const SUI_PROVIDER_CONFIG = {
  // SUI_PROVIDER_CLIENT_ID: process.env.SUI_PROVIDER_CLIENT_ID,
  // SUI_PROVIDER_CLIENT_SECRET: process.env.SUI_PROVIDER_CLIENT_SECRET,
  SUI_OWNER: process.env.SUI_PROVIDER_OWNER,
  SUI_CAP: process.env.SUI_PROVIDER_CAP,
  SUI_PROVIDER_ID: process.env.SUI_PROVIDER_PROVIDER_ID,
} as const;

export const VERISOUL_CONFIG = {
  VERISOUL_OWNER: process.env.VERISOUL_OWNER,
  VERISOUL_CAP: process.env.VERISOUL_CAP,
  VERISOUL_PROVIDER_ID: process.env.VERISOUL_PROVIDER_ID,
  VERISOUL_API_KEY:
    process.env.VERISOUL_API_KEY || 'kNIEf4Sj9odUo1LARYWFdPaHS8ScZnVtswd3xFbI',
};

export const DISCORD_CONFIG = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI:
    process.env.DISCORD_REDIRECT_URI ??
    'https://suipass.xyz?suipassProvider=discord',
  DISCORD_OWNER: process.env.DISCORD_OWNER,
  DISCORD_CAP: process.env.DISCORD_CAP,
  DISCORD_PROVIDER_ID: process.env.DISCORD_PROVIDER_ID,
} as const;
