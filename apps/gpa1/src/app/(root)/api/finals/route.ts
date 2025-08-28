import { getSheetValues } from '@/services/googleSheetsServiceCloudflareCompatible';
import { Match, parseSheet } from '@/models/eventMatch';

export async function GET() {
  try {
    const range = 'Grand Finals!A1:J27';
    const rows = await getSheetValues(range);

    const matchData: Match[] = parseSheet(rows, false);
    return Response.json({ matchData });
  } catch (err) {
    console.error('Error fetching data from Sheets:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}
