import { parseLocalDate } from './date';

/**
 * The URL of the Google Form used for submission.
 */
export const submissionUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdtahyQGjHnLUg3bprDW8Q5qRaGVToAE2rfuzYcLrq0hveXyw/viewform';

/**
 * The ID for the Google Sheet containing qualifier submissions.
 */
export const qualifiersSpreadsheetId =
  '1FQ05Q3CyyP5uD38p8sgaIcxn_NwCVKyyUTn7zOBnL8A';

export const numMastersFinalists = 8;
export const numChallengersFinalists = 16;

export const qualifiersEndTimestamp =
  parseLocalDate('2023-11-30 00:59').getTime();

export const leaderboardFreezeStartTimestamp =
  parseLocalDate('2023-11-30 00:59').getTime();
export const leaderboardFreezeEndTimestamp =
  parseLocalDate('2023-11-30 00:59').getTime();
