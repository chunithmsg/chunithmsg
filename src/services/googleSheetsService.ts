import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const sheets = google.sheets("v4");

export const getAndSetAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();

  // Use this authClient for future calls.
  // The TS error can possibly be avoided by casting authClient into
  // "JSONClient", but I can't figure out how to import the type.
  // @ts-expect-error
  google.options({ auth: authClient });
  return authClient;
};

export const getSpreadSheetValues = async (
  spreadsheetId: string,
  sheetName: string
) => {
  return await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });
};
