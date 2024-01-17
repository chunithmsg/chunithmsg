import {
  leaderboardFreezeEndTimestamp,
  leaderboardFreezeStartTimestamp,
  qualifiersEndTimestamp,
  parseLocalDate,
} from '@/libs';

describe('Date Utils', () => {
  it('Test parseLocalDate', () => {
    // Assumed: UTC+8
    const localDateString = '2023-05-06 18:01';

    // UTC: 2023-05-06 10:01
    const expectedTimestamp = Date.UTC(2023, 4, 6, 10, 1);

    const actualDate = parseLocalDate(localDateString);
    const actualTimestamp = actualDate.getTime();

    expect(actualTimestamp).toEqual(expectedTimestamp);
  });

  it.each([
    {
      localDateString: '2023-05-06 18:01',
      expectedTimestamp: Date.UTC(2023, 4, 6, 18, 1) - 8 * 60 * 60 * 1000,
    },
    {
      localDateString: '2023-05-06 18',
      expectedTimestamp: Date.UTC(2023, 4, 6, 18, 0) - 8 * 60 * 60 * 1000,
    },
    {
      localDateString: '2023-05-06',
      expectedTimestamp: Date.UTC(2023, 4, 6, 0, 0) - 8 * 60 * 60 * 1000,
    },
    {
      localDateString: '2023-05',
      expectedTimestamp: Date.UTC(2023, 4, 1, 0, 0) - 8 * 60 * 60 * 1000,
    },
    {
      localDateString: '2023',
      expectedTimestamp: Date.UTC(2023, 0, 1, 0, 0) - 8 * 60 * 60 * 1000,
    },
  ])(
    'parseLocalDate with less than 5 fields: "$localDateString"',
    ({ localDateString, expectedTimestamp }) => {
      const actualDate = parseLocalDate(localDateString);
      const actualTimestamp = actualDate.getTime();

      expect(actualTimestamp).toEqual(expectedTimestamp);
    },
  );

  it.each([
    {
      constant: qualifiersEndTimestamp,
      expected: 1686499200000, // Midnight (GMT+8), 12th June
    },
    {
      constant: leaderboardFreezeStartTimestamp,
      expected: 1686326400000, // Midnight (GMT+8), 10th June
    },
    {
      constant: leaderboardFreezeEndTimestamp,
      expected: 1686499200000, // Midnight (GMT+8), 12th June
    },
  ])('Test constants', ({ constant, expected }) => {
    expect(constant).toEqual(expected);
  });
});
