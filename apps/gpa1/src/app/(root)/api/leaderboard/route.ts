import {
  getAuthClient,
  getSpreadSheetValues,
} from '@/services/googleSheetsService';
import {
  compareSubmissions,
  filterSubmissions,
  parseSubmissionRow,
  Submission,
} from '@/models/qualifierSubmission';

export async function GET() {
  try {
    // Retrieve sheet values
    const auth = await getAuthClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
    const range = 'Sheet1!A2:R';

    const response = await getSpreadSheetValues(spreadsheetId, auth, range);
    const rows = response.data.values || [];

    let leaderboard: Submission[] = [];
    rows.map((row) => {
      const submission = parseSubmissionRow(row);
      if (submission.isVoidSubmission) return;
      leaderboard.push(submission);
    });

    leaderboard = filterSubmissions(leaderboard);
    leaderboard.sort(compareSubmissions);

    return Response.json({ leaderboard });
  } catch (err) {
    console.error('Error fetching data from Sheets:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}
