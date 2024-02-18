'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import type { Standing } from '@/models/standing';
// import IndividualSongLeaderboard from '@/components/IndividualSongLeaderboard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { SongWithJacket } from '@/libs';
import { formatScore, formatTimestamp, songDetails, cn } from '@/libs';

import nokcamellia from '@/../public/sunplustourney/qualifiers/nokcamellia.jpg';
import pangaea from '@/../public/sunplustourney/qualifiers/pangaea.jpg';
import singularity from '@/../public/sunplustourney/qualifiers/singularityoflove.jpg';

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
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const axios = (await import('@/libs/axios')).getAxiosInstance();
      const { data } = await axios.get<{
        qualifiers: Standing[];
        individualSongStandings: Standing[];
      }>('/api/submissions');
      return data;
    },
  });

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
      <Table className="overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="w-16">
              #
            </TableHead>
            <TableHead rowSpan={2} className="w-48">
              IGN
            </TableHead>
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
            <TableHead rowSpan={2} className="w-28">
              Total Score
            </TableHead>
            <TableHead rowSpan={2} className="w-28">
              Time of Play
            </TableHead>
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
          {leaderboard?.qualifiers.map((standing, index) => (
            <TableRow
              key={`${index}${standing.ign}`}
              className={cn(
                standing.isDisqualified
                  ? 'bg-destructive/20 even:bg-destructive/20 hover:bg-destructive/50 data-[state=selected]:bg-destructive'
                  : standing.qualifiedIndex &&
                    standing.qualifiedIndex <= 30 &&
                    standing.qualifiedIndex > 0
                  ? 'bg-success/20 even:bg-success/20 hover:bg-success/50 data-[state=selected]:bg-success'
                  : 'bg-background/20 even:bg-background/20 hover:bg-muted/50 data-[state=selected]:bg-muted',
                hideDisqualified && standing.isDisqualified ? 'hidden' : '',
              )}
            >
              <TableCell>
                {hideDisqualified ? standing.qualifiedIndex : index + 1}
              </TableCell>
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
      {leaderboard?.qualifiers.length === 0 && (
        <div className="flex min-h-max justify-center items-center mt-8">
          Empty leaderboard :(
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
