import { qualifiersSpreadsheetId } from "@/constants";
import {
  getAuthToken,
  getSpreadSheetValues,
} from "@/services/googleSheetsService";

describe("Google Sheets Service", () => {
  it("Token can be obtained", async () => {
    await getAuthToken();
  });

  it("Google Sheet can be read", async () => {
    const authToken = await getAuthToken();
    const result = await getSpreadSheetValues(
      qualifiersSpreadsheetId,
      authToken,
      "'Masters Set A - Dumping Ground'!A3:H5"
    );

    console.log("Data", result.data.values);
  });
});
