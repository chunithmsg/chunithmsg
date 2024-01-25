'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import type { Standing } from '@/models/standing';
import type { IndividualSongStanding } from '@/models/individualSongStanding';
// import IndividualSongLeaderboard from '@/components/IndividualSongLeaderboard';

import type { SongWithJacket } from '@/libs';
import { formatScore, formatTimestamp, songDetails, fetcher, cn } from '@/libs';

import nokcamellia from '../../public/sunplustourney/qualifiers/nokcamellia.jpg';
import pangaea from '../../public/sunplustourney/qualifiers/pangaea.jpg';
import singularity from '../../public/sunplustourney/qualifiers/singularityoflove.jpg';

const SongScoreLabel = dynamic(() => import('@/components/SongScoreLabel'));
const Badge = dynamic(() => import('@/components/ui/badge').then((mod) => mod.Badge));
const Label = dynamic(() => import('@/components/ui/label').then((mod) => mod.Label));
const Switch = dynamic(() => import('@/components/ui/switch').then((mod) => mod.Switch));
// const Tabs = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.Tabs));
// const TabsContent = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.TabsContent));
// const TabsList = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.TabsList));
// const TabsTrigger = dynamic(() => import('@/components/ui/tabs').then((mod) => mod.TabsTrigger));
const Table = dynamic(() => import('@/components/ui/table').then((mod) => mod.Table));
const TableBody = dynamic(() => import('@/components/ui/table').then((mod) => mod.TableBody));
const TableCell = dynamic(() => import('@/components/ui/table').then((mod) => mod.TableCell));
const TableHead = dynamic(() => import('@/components/ui/table').then((mod) => mod.TableHead));
const TableHeader = dynamic(() => import('@/components/ui/table').then((mod) => mod.TableHeader));
const TableRow = dynamic(() => import('@/components/ui/table').then((mod) => mod.TableRow));

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

const Leaderboard = () => {
  const [hideDisqualified, setHideDisqualified] = useState<boolean>(true);
  // const [serverUnixTimestamp, setServerUnixTimestamp] = useState<number>(0);
  const { data, isLoading } = useSWR<
    {
      qualifiers: Standing[];
      individualSongStandings: IndividualSongStanding[];
    },
    any
  >('/api/submissions', fetcher);

  // useEffect(() => {
  //   const currentServerUnixTimestamp = getCurrentTime();
  //   setServerUnixTimestamp(serverUnixTimestamp);
  // }, [])

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
                  className="max-h-[90px] max-w-[90px] w-auto h-auto"
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
          {data?.qualifiers.map((standing, index) => (
            <TableRow
              key={`${index}${standing.ign}`}
              className={cn(
                'even:bg-background',
                standing.isDisqualified ? 'bg-destructive/20' : '',
                hideDisqualified && standing.isDisqualified ? 'hidden' : '',
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
                <SongScoreLabel
                  songScore={{
                    score: standing.song1.score,
                    ajFcStatus: standing.song1.ajFcStatus,
                  }}
                />
              </TableCell>
              <TableCell>
                <SongScoreLabel
                  songScore={{
                    score: standing.song2.score,
                    ajFcStatus: standing.song2.ajFcStatus,
                  }}
                />
              </TableCell>
              <TableCell>
                <SongScoreLabel
                  songScore={{
                    score: standing.song3.score,
                    ajFcStatus: standing.song3.ajFcStatus,
                  }}
                />
              </TableCell>
              <TableCell>{formatScore(standing.totalScore)}</TableCell>
              <TableCell>{formatTimestamp(standing.timestamp)}</TableCell>
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
      {data?.qualifiers.length === 0 && (
        <div className="flex min-h-max justify-center items-center mt-8">
          No submissions yet.
        </div>
      )}
      {/* </TabsContent>
        <TabsContent value="individuals">
          Change your password here.
        </TabsContent>
      </Tabs> */}
    </>
  );
};

export default Leaderboard;
