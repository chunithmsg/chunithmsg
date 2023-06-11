import { qualifiersSpreadsheetId } from "@/utils/constants";
import {
  getAuthClient,
  getSpreadSheetValues,
} from "@/services/googleSheetsService";

describe("Google Sheets Service", () => {
  it("Token can be obtained", async () => {
    await getAuthClient();
  });

  it("Google Sheet can be read", async () => {
    const authToken = await getAuthClient();
    const result = await getSpreadSheetValues(
      qualifiersSpreadsheetId,
      authToken,
      "'Masters Set A - Dumping Ground'!A2:H2"
    );

    expect(result.status).toEqual(200);

    const headerRow = (result.data.values as string[][])[0];
    const firstHeaderCell = headerRow[1];

    expect(firstHeaderCell).toEqual("Timestamp of last song");
  });
});
