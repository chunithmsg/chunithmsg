'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SslFinalsDetails } from '@/models/ssl-finals/sslFinalsDetails';
import { formatScore } from '@/libs';

const isNonempty = (arr: any[] | undefined) =>
  arr !== undefined && arr.length > 0;

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
        '/public/sunplustourney/results.json',
      );
      return data;
    },
  });

  return (
    <>
      <h1>Finals</h1>
      <Tabs defaultValue="grandFinals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 my-5">
          <TabsTrigger value="grandFinals">Grand Finals</TabsTrigger>
          <TabsTrigger value="teamMatches">Team Matches</TabsTrigger>
          <TabsTrigger value="scoreAttack">Score Attack</TabsTrigger>
        </TabsList>
        <TabsContent value="grandFinals">
          {!isLoading && (
            <>
              {/* Grand Finals */}
              {sslFinalsDetails &&
                isNonempty(sslFinalsDetails.grandFinalsMatches) && (
                  <>
                    <h2>Grand Finals</h2>
                    {sslFinalsDetails.grandFinalsMatches
                      .toReversed()
                      .map((match) => (
                        <div key={match.matchName}>
                          <h3 className="mb-2">{match.matchName}</h3>
                          <Table className="overflow-hidden">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-48" rowSpan={2}>
                                  Song
                                </TableHead>
                                <TableHead className="w-96" colSpan={2}>
                                  Home Team:{' '}
                                  <strong>{match.homeTeamName}</strong>
                                </TableHead>
                                <TableHead className="w-96" colSpan={2}>
                                  Away Team:{' '}
                                  <strong>{match.awayTeamName}</strong>
                                </TableHead>
                              </TableRow>
                              <TableRow>
                                <TableHead className="w-24">Player</TableHead>
                                <TableHead className="w-48">Score</TableHead>
                                <TableHead className="w-24">Player</TableHead>
                                <TableHead className="w-48">Score</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {match.songResults.map((songResult, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {songResult.songName ?? '???'}
                                  </TableCell>
                                  <TableCell>
                                    {songResult.homeResult?.playerName ?? '???'}
                                  </TableCell>
                                  <TableCell>
                                    {formatScore(songResult.homeResult?.score)}
                                  </TableCell>
                                  <TableCell>
                                    {songResult.awayResult?.playerName ?? '???'}
                                  </TableCell>
                                  <TableCell>
                                    {formatScore(songResult.awayResult?.score)}
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
            </>
          )}
        </TabsContent>
        <TabsContent value="teamMatches">
          {/* Team Matches */}
          {sslFinalsDetails &&
            isNonempty(sslFinalsDetails.teamPhaseMatches) && (
              <>
                <h2>Team Match Phase</h2>
                <h3 className="mb-2">Team Standings</h3>
                <Table className="overflow-hidden">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead className="w-48">Team Name</TableHead>
                      <TableHead className="w-16">Wins</TableHead>
                      <TableHead className="w-16">Away Wins</TableHead>
                      <TableHead className="w-48">Score Diff</TableHead>
                      <TableHead className="w-16">Matches Played</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sslFinalsDetails.teamPhaseResults.map(
                      (teamResult, index) => (
                        <TableRow key={`${index}-${teamResult.teamId}`}>
                          <TableCell>{teamResult.rank}</TableCell>
                          <TableCell>{teamResult.teamName}</TableCell>
                          <TableCell>{teamResult.numWins}</TableCell>
                          <TableCell>{teamResult.numAwayWins}</TableCell>
                          <TableCell>
                            {formatScore(teamResult.totalScoreDiff)}
                          </TableCell>
                          <TableCell>{teamResult.numMatchesPlayed}</TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>

                {sslFinalsDetails.teamPhaseMatches.toReversed().map((match) => (
                  <div key={match.matchNumber}>
                    <h3 className="mb-2">Match {match.matchNumber}</h3>
                    <Table className="overflow-hidden">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48" rowSpan={2}>
                            Song
                          </TableHead>
                          <TableHead className="w-96" colSpan={2}>
                            Home Team: <strong>{match.homeTeamName}</strong>
                          </TableHead>
                          <TableHead className="w-96" colSpan={2}>
                            Away Team: <strong>{match.awayTeamName}</strong>
                          </TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead className="w-24">Player</TableHead>
                          <TableHead className="w-48">Score</TableHead>
                          <TableHead className="w-24">Player</TableHead>
                          <TableHead className="w-48">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {match.songResults.map((songResult, index) => (
                          <TableRow key={index}>
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
        </TabsContent>
        <TabsContent value="scoreAttack">
          {/* Score Attack */}
          <h2>Score Attack</h2>
          <h5 className="mt-6 mb-2">
            Song Name:{' '}
            <span className="font-semibold">
              {sslFinalsDetails?.scoreAttackPhase.songName ?? '???'}
            </span>
          </h5>
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead className="w-16">Seed</TableHead>
                <TableHead className="w-24">IGN</TableHead>
                <TableHead className="w-48">Score</TableHead>
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
                      {formatScore(playerScore.score, '---')}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
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
    </>
  );
};

export default SslFinals;
