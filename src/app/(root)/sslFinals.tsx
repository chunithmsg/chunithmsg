'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { SslFinalsDetails } from '@/models/ssl-finals/sslFinalsDetails';
import { formatScore } from '@/libs';

const isNonempty = (arr: any[] | undefined) =>
  arr !== undefined && arr.length > 0;

const SongScoreLabel = dynamic(() => import('@/components/SongScoreLabel'));
const Badge = dynamic(() =>
  import('@/components/ui/badge').then((mod) => mod.Badge),
);
const Label = dynamic(() =>
  import('@/components/ui/label').then((mod) => mod.Label),
);
const Switch = dynamic(() =>
  import('@/components/ui/switch').then((mod) => mod.Switch),
);
// const Tabs = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.Tabs));
// const TabsContent = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.TabsContent));
// const TabsList = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.TabsList));
// const TabsTrigger = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.TabsTrigger));
const Table = dynamic(() =>
  import('@/components/ui/table').then((mod) => mod.Table),
);
const TableBody = dynamic(() =>
  import('@/components/ui/table').then((mod) => mod.TableBody),
);
const TableCell = dynamic(() =>
  import('@/components/ui/table').then((mod) => mod.TableCell),
);
const TableHead = dynamic(() =>
  import('@/components/ui/table').then((mod) => mod.TableHead),
);
const TableHeader = dynamic(() =>
  import('@/components/ui/table').then((mod) => mod.TableHeader),
);
const TableRow = dynamic(() =>
  import('@/components/ui/table').then((mod) => mod.TableRow),
);

const SslFinals = () => {
  const { data: sslFinalsDetails, isLoading } = useQuery({
    queryKey: ['ssl-finals-details'],
    queryFn: async () => {
      const axios = (await import('@/libs/axios')).getAxiosInstance();
      const { data } = await axios.get<SslFinalsDetails>(
        '/api/ssl-finals-details',
      );
      return data;
    },
  });

  return (
    <>
      <h1>Singapore SUN+ers League Finals</h1>
      {isLoading && (
        <div className="flex min-h-max justify-center items-center mt-8">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin h-5 w-5 mr-3"
          >
            <path
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
          </svg>
          Loading...
        </div>
      )}
      {!isLoading && (
        <>
          {/* Team Matches */}
          {sslFinalsDetails &&
            isNonempty(sslFinalsDetails.teamPhaseMatches) && (
              <>
                <h2>Team Match Phase</h2>

                {sslFinalsDetails.teamPhaseMatches.map((match) => (
                  <div key={match.matchNumber}>
                    <h3>{`Match #${match.matchNumber}`}</h3>
                    <div>{`Home team: ${match.homeTeamName}`}</div>
                    <div>{`Away team: ${match.awayTeamName}`}</div>
                    <Table className="overflow-hidden">
                      <TableHeader>
                        <TableRow>
                          <TableHead rowSpan={2} className="w-48">
                            Song
                          </TableHead>
                          <TableHead rowSpan={2} className="w-48">
                            Home Player
                          </TableHead>
                          <TableHead rowSpan={2} className="w-48">
                            Score
                          </TableHead>
                          <TableHead rowSpan={2} className="w-48">
                            Away Player
                          </TableHead>
                          <TableHead rowSpan={2} className="w-48">
                            Score
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {match.songResults.map((songResult, index) => (
                          <TableRow key={`${match.matchNumber}-${index}`}>
                            <TableCell>{songResult.songName}</TableCell>
                            <TableCell>
                              {songResult.homeResult.playerName}
                            </TableCell>
                            <TableCell>
                              {formatScore(songResult.homeResult.score)}
                            </TableCell>
                            <TableCell>
                              {songResult.awayResult.playerName}
                            </TableCell>
                            <TableCell>
                              {formatScore(songResult.awayResult.score)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow key="total">
                          <TableCell>Total Score</TableCell>
                          <TableCell />
                          <TableCell>
                            {formatScore(match.homeTotalScore)}
                          </TableCell>
                          <TableCell />
                          <TableCell>
                            {formatScore(match.awayTotalScore)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </>
            )}
          {/* Score Attack */}
          <h2>Score Attack Phase</h2>
          <p>{`Song Name: ${
            sslFinalsDetails?.scoreAttackPhase.songName ?? '???'
          }`}</p>
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="w-16">
                  Rank
                </TableHead>
                <TableHead rowSpan={2} className="w-16">
                  Seed
                </TableHead>
                <TableHead rowSpan={2} className="w-48">
                  IGN
                </TableHead>
                <TableHead rowSpan={2} className="w-48">
                  Score
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sslFinalsDetails?.scoreAttackPhase.playerScores.map(
                (playerScore, index) => (
                  <TableRow key={`${index}-${playerScore.name}`}>
                    {/* I'm getting the 'each child should have a unique key' message for some reason? */}
                    <TableCell>{playerScore.rank}</TableCell>
                    <TableCell>{playerScore.seed}</TableCell>
                    <TableCell>{playerScore.name}</TableCell>
                    <TableCell>
                      {playerScore.score
                        ? formatScore(playerScore.score)
                        : '---'}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default SslFinals;
