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
    'https://suippass.xyz/dashboard?suipassProvider=google',
  GOOGLE_OWNER: process.env.GOOGLE_OWNER,
  GOOGLE_CAP: process.env.GOOGLE_CAP,
  GOOGLE_PROVIDER_ID: process.env.GOOGLE_PROVIDER_ID,
} as const;

export const TWITTER_CONFIG = {
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  TWITTER_REDIRECT_URI:
    process.env.TWITTER_REDIRECT_URI ??
    'https://suippass.xyz/dashboard?suipassProvider=twitter',
  TWITTER_OWNER: process.env.TWITTER_OWNER,
  TWITTER_CAP: process.env.TWITTER_CAP,
  TWITTER_PROVIDER_ID: process.env.TWITTER_PROVIDER_ID,
} as const;
