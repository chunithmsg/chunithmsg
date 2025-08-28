import { getSheetValues } from '@/services/googleSheetsServiceCloudflareCompatible';
import {
  parseSheet,
  calculateOverallStats,
  Match,
  PlayerStat,
  comparePlayerOverallStats,
} from '@/models/eventMatch';

export async function GET() {
  try {
    // Fetch swiss matches
    let swissMatches = [];
    for (let i = 1; i <= 4; i++) {
      const range = `Swiss Round ${i}!A1:J41`;
      const rows = await getSheetValues(range);

      const matchData: Match[] = parseSheet(rows, true);
      swissMatches.push(matchData);
    }

    // Overall stats
    const overallStats: PlayerStat[] = calculateOverallStats(swissMatches);
    overallStats.sort(comparePlayerOverallStats);

    return Response.json({ swissMatches, overallStats });
  } catch (err) {
    console.error('Error fetching data from Sheets:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}
