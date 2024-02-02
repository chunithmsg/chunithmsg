/**
 * Formats the given score using the "en-US" locale.
 *
 * @param score The score to format, given as the string representation of an integer.
 * @returns The formatted score.
 */
export const formatScore = (score: number) => score.toLocaleString('en-US');

export const formatOrdinal = (rank: number) => {
  if (rank % 10 === 1 && rank % 100 !== 11) {
    return `${rank}st`;
  }

  if (rank % 10 === 2 && rank % 100 !== 12) {
    return `${rank}nd`;
  }

  if (rank % 10 === 3 && rank % 100 !== 13) {
    return `${rank}rd`;
  }

  return `${rank}th`;
};

export const formatTimestamp = (timestamp: Date | number) =>
  new Date(timestamp).toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false,
  });
