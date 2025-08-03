import {
  getAuthClient,
  getSpreadSheetValues,
} from '@/services/googleSheetsService';
import { getSheetValues } from '@/services/googleSheetsServiceCloudflareCompatible';
import {
  compareSubmissions,
  filterSubmissions,
  getEarlySubmissions,
  parseSubmissionRow,
  Submission,
} from '@/models/qualifierSubmission';

export async function GET() {
  try {
    // Retrieve sheet values
    // const auth = await getAuthClient();
    const range = 'Qualifiers!A2:R';

    // const response = await getSpreadSheetValues(spreadsheetId, auth, range);

    // Temporary minimal fix for deployment with Cloudflare
    // Google Sheets API depend on modules like https which Cloudflare Workers does not support
    // Error: [unenv] https.request is not implemented yet!

    const rows = await getSheetValues(range);

    let leaderboard: Submission[] = [];
    rows.map((row) => {
      const submission = parseSubmissionRow(row);
      if (submission.isVoidSubmission) return;
      leaderboard.push(submission);
    });

    const earlySubmissions = getEarlySubmissions(leaderboard);
    leaderboard = filterSubmissions(leaderboard);
    leaderboard.sort(compareSubmissions);

    return Response.json({ leaderboard, earlySubmissions });
  } catch (err) {
    console.error('Error fetching data from Sheets:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}
