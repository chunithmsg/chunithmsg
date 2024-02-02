'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import type { Score } from '@/models/standing';

import type { SongWithJacket } from '@/libs';
import { formatScore, formatTimestamp, songDetails, cn } from '@/libs';

import nokcamellia from '../../../public/sunplustourney/qualifiers/nokcamellia.jpg';
import pangaea from '../../../public/sunplustourney/qualifiers/pangaea.jpg';
import singularity from '../../../public/sunplustourney/qualifiers/singularityoflove.jpg';

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

const qualifierSongs: SongWithJacket[] = [
  { songId: 'singularity', jacket: singularity },
  { songId: 'pangaea', jacket: pangaea },
  { songId: 'nokcamellia', jacket: nokcamellia },
];

// const individualQualifiersSongs: SongWithJacket[] = [
//   { songId: 'singularity', jacket: singularity },
//   { songId: 'pangaea', jacket: pangaea },
//   { songId: 'nokcamellia', jacket: nokcamellia },
// ];

const Leaderboard = ({ leaderboard }: { leaderboard: Array<Score> | null }) => {
  const [hideDisqualified, setHideDisqualified] = useState<boolean>(true);

  return (
    <>
      <h1>Leaderboard</h1>
      <div className="flex items-center space-x-2">
        <Switch
          id="hideDisqualified"
          name="toggleDisqualified"
          className="my-5"
          checked={hideDisqualified}
          onCheckedChange={setHideDisqualified}
        />
        <Label htmlFor="hideDisqualified">Hide Disqualified</Label>
      </div>
      {/* <Tabs defaultValue="qualifiers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qualifiers">Qualifiers</TabsTrigger>
          <TabsTrigger value="individuals">
            Individual Songs (Qualifiers)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="qualifiers"> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>#</TableHead>
            <TableHead rowSpan={2}>IGN</TableHead>
            {qualifierSongs.map((song, index) => (
              <TableHead key={`${index}${song.songId}`}>
                <Image
                  src={song.jacket}
                  alt={songDetails[song.songId].title}
                  className="max-h-36 max-w-36 w-36 h-36"
                  priority
                />
              </TableHead>
            ))}
            <TableHead rowSpan={2}>Total Score</TableHead>
            <TableHead rowSpan={2}>Time of Play</TableHead>
          </TableRow>
          <TableRow>
            {qualifierSongs.map((song, index) => (
              <TableHead key={`${index}${song.songId}`}>
                <span>{songDetails[song.songId].title}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard !== null &&
            leaderboard.map((standing, index) => (
              <TableRow
                key={`${index}${standing.ign}`}
                className={cn(
                  standing.disqualified
                    ? 'bg-destructive/20 even:bg-destructive/20 hover:bg-destructive/50 data-[state=selected]:bg-destructive'
                    : standing.qualified_index &&
                      standing.qualified_index <= 30 &&
                      standing.qualified_index > 0
                    ? 'bg-success/20 even:bg-success/20 hover:bg-success/50 data-[state=selected]:bg-success'
                    : 'bg-background/20 even:bg-background/20 hover:bg-muted/50 data-[state=selected]:bg-muted',
                  hideDisqualified && standing.disqualified ? 'hidden' : '',
                )}
              >
                <TableCell>
                  {hideDisqualified ? standing.qualified_index : index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 align-middle">
                    <span>{standing.ign}</span>
                    {standing.disqualified && (
                      <Badge variant="destructive">DQ</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <SongScoreLabel
                    songScore={{
                      score: standing.song1,
                      ajFcStatus: standing.song3_type,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <SongScoreLabel
                    songScore={{
                      score: standing.song2,
                      ajFcStatus: standing.song2_type,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <SongScoreLabel
                    songScore={{
                      score: standing.song3,
                      ajFcStatus: standing.song3_type,
                    }}
                  />
                </TableCell>
                <TableCell>{formatScore(standing.total_score)}</TableCell>
                <TableCell>{formatTimestamp(standing.played_at)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {leaderboard === null ||
        (leaderboard.length === 0 && (
          <div className="flex min-h-max justify-center items-center mt-8">
            No submissions yet.
          </div>
        ))}
      {/* </TabsContent>
        <TabsContent value="individuals">
          Change your password here.
        </TabsContent>
      </Tabs> */}
    </>
  );
};

export default Leaderboard;
