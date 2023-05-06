/**
 * Parses a local date/time string that has no specified timezone.
 *
 * @param dateTimeString A date and time string in the format "YYYY-MM-DD HH:mm"
 * @param timezoneOffsetInMilliseconds The offset between the local timezone and UTC.
 * If the timezone has a positive offset (e.g. UTC+2), this value should be positive.
 * @returns A Date object representing the local time.
 */
export const parseLocalDate = (
  dateTimeString: string,
  // I'm fed up with trying to find a nice way to do something like
  // timezoneOffsetOf("Asia/Singapore"), and I can sort of understand
  // why with DST and all that stuff, but wow am I just tired of trying
  // to find a 'nice' solution. So screw it - hardcoded 8 hours is what you get.
  timezoneOffsetInMilliseconds = 8 * 60 * 60 * 1000
) => {
  const tokens = dateTimeString.split(/\D/).map((token) => parseInt(token, 10));
  const pseudoTimestamp = Date.UTC(
    tokens[0],
    tokens[1] - 1,
    tokens[2],
    tokens[3],
    tokens[4]
  );

  return new Date(pseudoTimestamp - timezoneOffsetInMilliseconds);
};
