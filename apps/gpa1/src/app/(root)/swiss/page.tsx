'use client';

import dynamic from 'next/dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Match, PlayerStat } from '@/models/eventMatch';
import SongScoreLabel from '@/components/SongScoreLabel';
import { cn } from '@/libs/utils';

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

const GpaSwiss = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [overallStats, setOverallStats] = useState<PlayerStat[]>([]);

  // Unpack into 1D arrays to avoid explicit indexing (e.g. data[0].map(...))
  const [swissRound1, setSwissRound1] = useState<Match[]>([]);
  const [swissRound2, setSwissRound2] = useState<Match[]>([]);
  const [swissRound3, setSwissRound3] = useState<Match[]>([]);
  const [swissRound4, setSwissRound4] = useState<Match[]>([]);
  useEffect(() => {
    setLoading(true);
    const fetchSwissRoundsData = async () => {
      try {
        const response = await fetch('/api/swiss');
        const data: { swissMatches: Match[][]; overallStats: PlayerStat[] } =
          await response.json();
        setSwissRound1(data.swissMatches[0]);
        setSwissRound2(data.swissMatches[1]);
        setSwissRound3(data.swissMatches[2]);
        setSwissRound4(data.swissMatches[3]);
        setOverallStats(data.overallStats);
      } catch (err) {
        console.error('Error fetching Swiss Rounds data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSwissRoundsData();
  }, []);
  return (
    <>
      <h1>Swiss Rounds</h1>
      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-5 my-5">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="swiss-round-1">Swiss Round 1</TabsTrigger>
          <TabsTrigger value="swiss-round-2">Swiss Round 2</TabsTrigger>
          <TabsTrigger value="swiss-round-3">Swiss Round 3</TabsTrigger>
          <TabsTrigger value="swiss-round-4">Swiss Round 4</TabsTrigger>
        </TabsList>

        {/* Overall Stats */}
        <TabsContent value="overall">
          <h3>Overall Stats</h3>
          <Table className="mt-7">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-16 w-16">Rank</TableHead>
                <TableHead className="min-w-48 w-48">IGN</TableHead>
                <TableHead className="min-w-16 w-36">Matches Played</TableHead>
                <TableHead className="min-w-16 w-36">Total Points</TableHead>
                <TableHead className="min-w-16 w-36">
                  Total Deductions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overallStats.map((stat, index) => (
                <TableRow
                  key={`${stat.ign}-${index}`}
                  className={cn(
                    index < 9
                      ? 'bg-success/35 even:bg-success/35 hover:bg-success/60 data-[state=selected]:bg-success'
                      : 'bg-destructive/20 even:bg-destructive/20 hover:bg-destructive/50 data-[state=selected]:bg-destructive',
                  )}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{stat.ign}</TableCell>
                  <TableCell>{stat.matchesPlayed}</TableCell>
                  <TableCell>{stat.totalPoints}</TableCell>
                  <TableCell>{stat.totalDeductions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Round 1 */}
        <TabsContent value="swiss-round-1">
          {swissRound1.map((match) => (
            <>
              <h3>{match.matchName}</h3>
              <Table className="mt-7">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40 w-48">Player</TableHead>
                    {match.songs.map((songName) => (
                      <TableHead className="min-w-48 w-64">
                        {songName}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-18 w-24">
                      Total Deductions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {match.stats.map((playerStats, index) => (
                    <TableRow
                      key={`${playerStats.ign}-${index}`}
                      className={cn(
                        index === 0
                          ? 'bg-success/50 even:bg-success/50 hover:bg-success/60 data-[state=selected]:bg-success'
                          : index === 1
                            ? 'bg-success/35 even:bg-success/35 hover:bg-success/45 data-[state=selected]:bg-success'
                            : 'bg-success/20 even:bg-success/20 hover:bg-success/30 data-[state=selected]:bg-success',
                      )}
                    >
                      <TableCell>{playerStats.ign}</TableCell>
                      {playerStats.songDeductions.map((songScore) => (
                        <TableCell>
                          <SongScoreLabel songScore={songScore} />
                        </TableCell>
                      ))}
                      <TableCell>{playerStats.totalDeductions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ))}
          {!isLoading && swissRound1.length === 0 && (
            <div className="flex min-h-max justify-center items-center mt-8">
              No Match Data :(
            </div>
          )}
        </TabsContent>

        {/* Round 2 */}
        <TabsContent value="swiss-round-2">
          {swissRound2.map((match) => (
            <>
              <h3>{match.matchName}</h3>
              <Table className="mt-7">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40 w-48">Player</TableHead>
                    {match.songs.map((songName) => (
                      <TableHead className="min-w-48 w-64">
                        {songName}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-18 w-24">
                      Total Deductions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {match.stats.map((playerStats, index) => (
                    <TableRow
                      key={`${playerStats.ign}-${index}`}
                      className={cn(
                        index === 0
                          ? 'bg-success/50 even:bg-success/50 hover:bg-success/60 data-[state=selected]:bg-success'
                          : index === 1
                            ? 'bg-success/35 even:bg-success/35 hover:bg-success/45 data-[state=selected]:bg-success'
                            : 'bg-success/20 even:bg-success/20 hover:bg-success/30 data-[state=selected]:bg-success',
                      )}
                    >
                      <TableCell>{playerStats.ign}</TableCell>
                      {playerStats.songDeductions.map((songScore) => (
                        <TableCell>
                          <SongScoreLabel songScore={songScore} />
                        </TableCell>
                      ))}
                      <TableCell>{playerStats.totalDeductions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ))}
          {!isLoading && swissRound2.length === 0 && (
            <div className="flex min-h-max justify-center items-center mt-8">
              No Match Data :(
            </div>
          )}
        </TabsContent>

        {/* Round 3 */}
        <TabsContent value="swiss-round-3">
          {swissRound3.map((match) => (
            <>
              <h3>{match.matchName}</h3>
              <Table className="mt-7">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40 w-48">Player</TableHead>
                    {match.songs.map((songName) => (
                      <TableHead className="min-w-48 w-64">
                        {songName}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-18 w-24">
                      Total Deductions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {match.stats.map((playerStats, index) => (
                    <TableRow
                      key={`${playerStats.ign}-${index}`}
                      className={cn(
                        index === 0
                          ? 'bg-success/50 even:bg-success/50 hover:bg-success/60 data-[state=selected]:bg-success'
                          : index === 1
                            ? 'bg-success/35 even:bg-success/35 hover:bg-success/45 data-[state=selected]:bg-success'
                            : 'bg-success/20 even:bg-success/20 hover:bg-success/30 data-[state=selected]:bg-success',
                      )}
                    >
                      <TableCell>{playerStats.ign}</TableCell>
                      {playerStats.songDeductions.map((songScore) => (
                        <TableCell>
                          <SongScoreLabel songScore={songScore} />
                        </TableCell>
                      ))}
                      <TableCell>{playerStats.totalDeductions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ))}
          {!isLoading && swissRound3.length === 0 && (
            <div className="flex min-h-max justify-center items-center mt-8">
              No Match Data :(
            </div>
          )}
        </TabsContent>

        {/* Round 4 */}
        <TabsContent value="swiss-round-4">
          {swissRound4.map((match) => (
            <>
              <h3>{match.matchName}</h3>
              <Table className="mt-7">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40 w-48">Player</TableHead>
                    {match.songs.map((songName) => (
                      <TableHead className="min-w-48 w-64">
                        {songName}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-18 w-24">
                      Total Deductions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {match.stats.map((playerStats, index) => (
                    <TableRow
                      key={`${playerStats.ign}-${index}`}
                      className={cn(
                        index === 0
                          ? 'bg-success/50 even:bg-success/50 hover:bg-success/60 data-[state=selected]:bg-success'
                          : index === 1
                            ? 'bg-success/35 even:bg-success/35 hover:bg-success/45 data-[state=selected]:bg-success'
                            : 'bg-success/20 even:bg-success/20 hover:bg-success/30 data-[state=selected]:bg-success',
                      )}
                    >
                      <TableCell>{playerStats.ign}</TableCell>
                      {playerStats.songDeductions.map((songScore) => (
                        <TableCell>
                          <SongScoreLabel songScore={songScore} />
                        </TableCell>
                      ))}
                      <TableCell>{playerStats.totalDeductions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ))}
          {!isLoading && swissRound4.length === 0 && (
            <div className="flex min-h-max justify-center items-center mt-8">
              No Match Data :(
            </div>
          )}
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

export default GpaSwiss;
