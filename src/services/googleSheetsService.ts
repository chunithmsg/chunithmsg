import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const sheets = google.sheets("v4");

export const getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  return authClient;
};

export const getSpreadSheetValues = async (
  spreadsheetId: string,
  // It's supposed to be of type "JSONClient" but I have no idea how to import this type
  // Using Awaited<ReturnType<typeof getAuthToken>> doesn't work, because that's a union type of
  // JSONClient | Compute, and I can't cast it into JSONClient for aforementioned reasons.
  authClient: any,
  sheetName: string
) => {
  return await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth: authClient,
    range: sheetName,
  });
};
