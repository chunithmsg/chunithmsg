import { sheets, auth } from '@googleapis/sheets';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const sheetsClient = sheets({ version: 'v4' });

export type AuthClient = Awaited<ReturnType<typeof getAuthClient>>;

export const getAuthClient = async () => {
  const sheetsAuth = new auth.GoogleAuth({
    scopes: SCOPES,
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
  });

  const authClient = await sheetsAuth.getClient();
  return authClient;
};

export const getSpreadSheetValues = async (
  spreadsheetId: string,
  // It's supposed to be of type "JSONClient" but I have no idea how to import this type
  // Using Awaited<ReturnType<typeof getAuthToken>> doesn't work, because that's a union type of
  // JSONClient | Compute, and I can't cast it into JSONClient for aforementioned reasons.
  authClient: any,
  range: string,
) =>
  sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    auth: authClient,
    range,
  });
