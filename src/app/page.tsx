'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

// import { getCurrentTime } from '@/actions';
import { Standing } from '@/models/standing';
import { IndividualSongStanding } from '@/models/individualSongStanding';
import IndividualSongLeaderboard from '@/components/IndividualSongLeaderboard';
import SongScoreLabel from '@/components/SongScoreLabel';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SongWithJacket } from '@/libs';
import { formatScore, formatTimestamp, songDetails, fetcher, cn } from '@/libs';

import question from '@/../public/question.png';
import nokcamellia from "../../public/sunplustourney/qualifiers/nokcamellia.jpg";
import pangaea from "../../public/sunplustourney/qualifiers/pangaea.jpg";
import singularity from "../../public/sunplustourney/qualifiers/singularityoflove.jpg";

const qualifierSongs: SongWithJacket[] = [
  { songId: "singularity", jacket: singularity },
  { songId: "pangaea", jacket: pangaea },
  { songId: "nokcamellia", jacket: nokcamellia },
];

const individualQualifiersSongs: SongWithJacket[] = [
  { songId: "singularity", jacket: singularity },
  { songId: "pangaea", jacket: pangaea },
  { songId: "nokcamellia", jacket: nokcamellia },
];

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
                <TableHead>#</TableHead>
                <TableHead>IGN</TableHead>
                {qualifierSongs.map((song, index) => (
                  <TableHead key={`${index}${song.songId}`}>
                    <div className="flex flex-col">
                      <Image
                        src={song.jacket}
                        alt={songDetails[song.songId].title}
                        priority
                      />
                      <hr className="my-2" />
                      <span>{songDetails[song.songId].title}</span>
                    </div>
                  </TableHead>
                ))}
                <TableHead>Total Score</TableHead>
                <TableHead>Time of Play</TableHead>
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
