import { getDeductions, getFcAjStatus } from './qualifierSubmission';
import { SongScore } from './songScore';

export type MatchStat = {
  ign: string;
  songDeductions: SongScore[]; // Size 2 array (2 songs per match)
  totalDeductions: number;
};

export type Match = {
  matchName: string;
  songs: string[];
  stats: MatchStat[];
};

// Players in qualifier seed order
// TODO: Update with actual finalists
export const allPlayers = [
  'Ｊｕｄｉ',
  'Ｓａｌｔｉｆｙ☆',
  'ＲＯＢＩＮ',
  'Ｎｏｓｔｏｓ♪',
  'ｄｒｅａｍｕ',
  'Ｂｌａｚｅ',
  'ＲＡＶＥＩＬＬＥ',
  'ＴＨＡＴＣＡＴ',
  '♂Ｍｉｚｕｋｉ♀',
  'Ｋｅｒｏ',
  'ｇｔ~',
  '１３３†ＤＡＤ？',
  'ＡＡ７２',
  'Ｗａｓｈｄｏｗｎ',
  'Ｓｔｒａｋｅｒ☆',
  'ｗｈａｔｓａｐｐ',
  '▽・Ｆ',
  'ｑｕｉｔ・ω・？',
];

export type PlayerStat = {
  ign: string;
  seed: number; // Qualifier seed
  matchesPlayed: number;
  matchesWon: number; // 1st places
  matchesLost: number; // 3rd places
  totalPoints: number;
  totalDeductions: number;
};

const columnConstants = {
  ign: 0,
  song1: 1,
  song2: 4,
  totalDeductions: 7,
  matchCompleted: 9,
};

// Parsing match data blocks (7x10 array)
const parseMatch = (data: string[][]) => {
  const isCompleted = data[0][columnConstants.matchCompleted] == 'TRUE';
  if (!isCompleted) return null;

  // Match name
  const matchName = data[0][0];

  // Song names
  const songs: string[] = [
    data[1][columnConstants.song1],
    data[1][columnConstants.song2],
  ];

  // Player data
  const stats: MatchStat[] = [];
  for (let row = 3; row < 6; row++) {
    // Calculate individual song stats
    const songStats1: number[] = data[row].slice(1, 4).map((x) => parseInt(x));
    const songStats2: number[] = data[row].slice(4, 7).map((x) => parseInt(x));
    const deduction1: number = getDeductions(songStats1);
    const deduction2: number = getDeductions(songStats2);
    const ajFcStatus1: '' | 'FC' | 'AJ' | 'AJC' = getFcAjStatus(songStats1);
    const ajFcStatus2: '' | 'FC' | 'AJ' | 'AJC' = getFcAjStatus(songStats2);

    // Construct player stat object
    const playerStat: MatchStat = {
      ign: data[row][columnConstants.ign],
      songDeductions: [
        { score: deduction1, ajFcStatus: ajFcStatus1 },
        { score: deduction2, ajFcStatus: ajFcStatus2 },
      ],
      totalDeductions: parseInt(data[row][columnConstants.totalDeductions]),
    };
    stats.push(playerStat);
  }

  // Sort by deductions (Tiebreak: Lower seeded/ranked player wins due to disadvantage in pick/ban process)
  stats.reverse().sort((a, b) => b.totalDeductions - a.totalDeductions);
  return { matchName, songs, stats };
};

export const parseSheet = (data: string[][], swiss: boolean) => {
  const roundData: Match[] = [];
  for (let matchId = 0; matchId < (swiss ? 6 : 4); matchId++) {
    const matchData = parseMatch(data.slice(matchId * 7, (matchId + 1) * 7));
    if (matchData) roundData.push(matchData);
  }
  return roundData;
};

// Calculate overall stats over all rounds after parsing sheet data through parseSheet()
export const calculateOverallStats = (parsedSwissData: Match[][]) => {
  // Initialise stats
  let overallStats: PlayerStat[] = [];
  allPlayers.map((player, index) => {
    overallStats.push({
      ign: player,
      seed: index + 1,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      totalPoints: 0,
      totalDeductions: 0,
    });
  });

  // Parse all Swiss Round stats
  parsedSwissData.map((swissRound) => {
    swissRound.map((swissMatch) => {
      swissMatch.stats.map((playerStat, placing) => {
        const player = overallStats.find((p) => p.ign === playerStat.ign);
        if (player) {
          player.matchesPlayed += 1;
          if (placing === 0) player.matchesWon += 1;
          if (placing === 2) player.matchesLost += 1;
          player.totalPoints += 2 - placing;
          player.totalDeductions += playerStat.totalDeductions;
        }
      });
    });
  });

  return overallStats;
};

export const comparePlayerOverallStats = (
  playerA: PlayerStat,
  playerB: PlayerStat,
) => {
  return playerA.totalPoints === playerB.totalPoints
    ? playerA.totalDeductions === playerB.totalDeductions
      ? playerB.seed - playerA.seed
      : playerB.totalDeductions - playerA.totalDeductions
    : playerB.totalPoints - playerA.totalPoints;
};
