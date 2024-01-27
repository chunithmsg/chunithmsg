import { parseLocalDate } from './date';

export const creatorGitHubUrls = {
  donjar: 'https://github.com/donjar',
  xantho09: 'https://github.com/xantho09',
  yytan25: 'https://github.com/yytan25',
  notlega: 'https://github.com/notlega',
} as const;

/**
 * The URL of the Calendly page for booking qualifier slots.
 */
export const qualifierBookingUrl =
  'https://calendly.com/beazaters/chunithm-tournament-live-qualifiers';

/**
 * The ID for the Google Sheet containing qualifier submissions.
 */
export const qualifiersSpreadsheetId =
  '1FQ05Q3CyyP5uD38p8sgaIcxn_NwCVKyyUTn7zOBnL8A';

export const numMastersFinalists = 30 as const;

export const qualifiersEndTimestamp =
  parseLocalDate('2023-11-30 00:59').getTime();

export const leaderboardFreezeStartTimestamp =
  parseLocalDate('2023-11-30 00:59').getTime();
export const leaderboardFreezeEndTimestamp =
  parseLocalDate('2023-11-30 00:59').getTime();

export const SNOWFLAKE_EPOCH = 1640995200 as const;
