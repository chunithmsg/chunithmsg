'use client';

import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';
import { Match } from '@/models/eventMatch';
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

const GpaFinals = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [grandFinalsData, setGrandFinalsData] = useState<Match[]>([]);
  useEffect(() => {
    setLoading(true);
    const fetchSwissRoundsData = async () => {
      try {
        const response = await fetch('/api/finals');
        const data: { matchData: Match[] } = await response.json();
        setGrandFinalsData(data.matchData);
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
      <h1>Grand Finals</h1>
      {grandFinalsData.map((match) => (
        <>
          <h3>{match.matchName}</h3>
          <Table className="mt-7">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-40 w-48">Player</TableHead>
                {match.songs.map((songName) => (
                  <TableHead className="min-w-48 w-64">{songName}</TableHead>
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
                      ? 'bg-success/35 even:bg-success/35 hover:bg-success/65 data-[state=selected]:bg-success'
                      : 'bg-destructive/20 even:bg-destructive/20 hover:bg-destructive/50 data-[state=selected]:bg-destructive',
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
      {!isLoading && grandFinalsData.length === 0 && (
        <div className="flex min-h-max justify-center items-center mt-8">
          No Match Data :(
        </div>
      )}
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

export default GpaFinals;
