'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/libs/utils';
import { songDetails } from '@/libs';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { SongWithJacket } from '@/libs';
import { Submission } from '@/models/qualifierSubmission';

const SongScoreLabel = dynamic(() => import('@/components/SongScoreLabel'));
const Badge = dynamic(() =>
  import('@/components/ui/badge').then((mod) => mod.Badge),
);
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

const qualifierSongs: SongWithJacket[] = [
  {
    songId: 'unknown1',
    jacket: '/rules/level13+.png',
  },
  { songId: 'unknown2', jacket: '/rules/level13+.png' },
  {
    songId: 'unknown3',
    jacket: '/rules/level14.png',
  },
];

const Leaderboard = () => {
  const [hideDisqualified, setHideDisqualified] = useState<boolean>(true);
  const [leaderboard, setLeaderboard] = useState<Submission[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const displayLeaderboard: Submission[] = hideDisqualified
    ? leaderboard.filter((submission) => !submission.isDisqualified)
    : leaderboard;

  return (
    <>
      <h1>Qualifiers Leaderboard</h1>
      <div className="flex items-center space-x-2">
        <Switch
          id="hideDisqualified"
          name="toggleDisqualified"
          className="my-5"
          checked={hideDisqualified}
          onCheckedChange={setHideDisqualified}
        />
        <Label htmlFor="hideDisqualified">Hide Staff Scores</Label>
      </div>
      <Table className="overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="w-16">
              #
            </TableHead>
            <TableHead rowSpan={2} className="w-48">
              IGN
            </TableHead>
            {qualifierSongs.map((song) => (
              <TableHead key={song.songId}>
                <div className="relative max-h-36 max-w-36 w-36 h-36 mx-auto">
                  <Image
                    src={song.jacket}
                    alt={songDetails[song.songId].title}
                    priority
                    fill
                  />
                </div>
              </TableHead>
            ))}
            <TableHead rowSpan={2} className="w-28">
              Total Deductions
            </TableHead>
            <TableHead rowSpan={2} className="w-28">
              Time of Play
            </TableHead>
          </TableRow>
          <TableRow>
            {qualifierSongs.map((song) => (
              <TableHead key={song.songId}>
                <span>{songDetails[song.songId].title}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayLeaderboard.map((standing, index) => (
            <TableRow
              key={`${standing.ign}-${standing.discordSubmissionTimestamp}`}
              className={cn(
                // eslint-disable-next-line no-nested-ternary
                standing.isDisqualified
                  ? 'bg-destructive/20 even:bg-destructive/20 hover:bg-destructive/50 data-[state=selected]:bg-destructive'
                  : index < 6 && index >= 0
                    ? 'bg-success/50 even:bg-success/50 hover:bg-success/60 data-[state=selected]:bg-success'
                    : index >= 6 && index < 12
                      ? 'bg-success/35 even:bg-success/35 hover:bg-success/45 data-[state=selected]:bg-success'
                      : index >= 12 && index < 18
                        ? 'bg-success/20 even:bg-success/20 hover:bg-success/30 data-[state=selected]:bg-success'
                        : 'bg-background/20 even:bg-background/20 hover:bg-muted/50 data-[state=selected]:bg-muted',
              )}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex gap-2 align-middle">
                  <span>{standing.ign}</span>
                  {standing.isDisqualified && (
                    <Badge variant="destructive">DQ</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <SongScoreLabel songScore={standing.songScores[0]} />
              </TableCell>
              <TableCell>
                <SongScoreLabel songScore={standing.songScores[1]} />
              </TableCell>
              <TableCell>
                <SongScoreLabel songScore={standing.songScores[2]} />
              </TableCell>
              <TableCell>
                {standing.songScores[0].score +
                  standing.songScores[1].score +
                  standing.songScores[2].score}
              </TableCell>
              <TableCell>
                {new Date(standing.discordSubmissionTimestamp).toLocaleString(
                  'en-GB',
                  {
                    timeZone: 'Singapore',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  },
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
      {displayLeaderboard.length === 0 && !isLoading && (
        <div className="flex min-h-max justify-center items-center mt-8">
          Empty leaderboard :(
        </div>
      )}
    </>
  );
};

export default Leaderboard;
