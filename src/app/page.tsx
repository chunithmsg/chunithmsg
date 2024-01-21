'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

// import { getCurrentTime } from '@/actions';
import { Standing } from '@/models/standing';
import { SongScore } from '@/models/songScore';
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
import { formatScore, formatTimestamp, songDetails, fetcher } from '@/libs';

import question from '@/../public/question.png';

const qualifierSongs: SongWithJacket[] = [
  { songId: 'question', jacket: question },
  { songId: 'question', jacket: question },
  { songId: 'question', jacket: question },
];

const individualQualifiersSongs: SongWithJacket[] = [
  { songId: 'question', jacket: question },
  { songId: 'question', jacket: question },
  { songId: 'question', jacket: question },
];

const Leaderboard = () => {
  const [hideDisqualified, setHideDisqualified] = useState<boolean>(true);
  // const [serverUnixTimestamp, setServerUnixTimestamp] = useState<number>(0);
  const {
    data,
  }: {
    data?: {
      qualifiers: Standing[];
      individualSongStandings: IndividualSongStanding[];
    };
  } = useSWR('/api/submissions', fetcher);

  // useEffect(() => {
  //   const currentServerUnixTimestamp = getCurrentTime();
  //   setServerUnixTimestamp(serverUnixTimestamp);
  // }, [])

  return (
    <section>
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
      <Tabs defaultValue="qualifiers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qualifiers">Qualifiers</TabsTrigger>
          <TabsTrigger value="individuals">
            Individual Songs (Qualifiers)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="qualifiers">
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
                <TableRow key={`${index}${standing.ign}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{standing.ign}</TableCell>
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
                  <TableCell>
                      {formatScore(standing.totalScore)}
                  </TableCell>
                  <TableCell>{formatTimestamp(standing.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="individuals">
          Change your password here.
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Leaderboard;
