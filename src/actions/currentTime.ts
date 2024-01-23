'use server';

/**
 * This method is purely for obtaining the current time from the server side,
 * instead of using the user's clock. Kind of important when you rely on the
 * current time to decide if the leaderboard should be frozen.
 *
 * @returns The current time as a Unix timestamp.
 */
export const getCurrentTime = () => Date.now();
