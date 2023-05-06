import { parseLocalDate } from "@/utils/dateUtils";

describe("Date Utils", () => {
  it("Test parseLocalDate", () => {
    // Assumed: UTC+8
    const localDateString = "2023-05-06 18:01";

    // UTC: 2023-05-06 10:01
    const expectedTimestamp = Date.UTC(2023, 4, 6, 10, 1);

    const actualDate = parseLocalDate(localDateString);
    const actualTimestamp = actualDate.getTime();

    expect(actualTimestamp).toBe(expectedTimestamp);
  });
});
