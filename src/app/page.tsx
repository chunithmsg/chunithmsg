"use client";

import { Table, Switch, Tabs, Button, Tag } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import Image from "next/image";

import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Standing } from "@/models/standing";
import { ColumnsType } from "antd/es/table";
import { SongScore } from "@/models/songScore";
import { IndividualSongStanding } from "@/models/individualSongStanding";
import IndividualSongLeaderboard from "@/components/IndividualSongLeaderboard";
import SongScoreLabel from "@/components/SongScoreLabel";
import { SongWithJacket } from "@/utils/songUtils";
import { formatScore, formatTimestamp } from "@/utils/leaderboardUtils";

import wakeUpDreamer from "../../public/wakeupdreamer.png";
import chaos from "../../public/chaos.png";
import pygmalion from "../../public/pygmalion.png";
import valsqotch from "../../public/valsqotch.png";
import imperishableNight from "../../public/imperishablenight.png";
import battleNo1 from "../../public/battleno1.png";
import spica from "../../public/spica.png";
import weGonnaJourney from "../../public/wegonnajourney.png";
import blazingStorm from "../../public/blazingstorm.png";

interface Song {
  image: any;
  title: string;
  genre?: Genre;
}

type Genre = "variety" | "original" | "gekimai" | "touhou" | "";

const challengerSongs: Song[] = [
  { image: wakeUpDreamer, title: "Wake up Dreamer", genre: "original" },
  { image: chaos, title: "CHAOS", genre: "variety" },
  { image: pygmalion, title: "ピュグマリオンの咒文", genre: "original" },
];

const masterSongs: Song[] = [
  { image: valsqotch, title: "Valsqotch", genre: "gekimai" },
  {
    image: imperishableNight,
    title: "Imperishable Night 2006\n(2016 Refine)",
    genre: "touhou",
  },
  { image: battleNo1, title: "BATTLE NO.1", genre: "variety" },
  { image: spica, title: "スピカの天秤", genre: "original" },
  { image: weGonnaJourney, title: "We Gonna Journey", genre: "original" },
  { image: blazingStorm, title: "Blazing:Storm", genre: "original" },
];

const individualMastersSongs: SongWithJacket[] = [
  { songId: "valsqotch", jacket: valsqotch },
  { songId: "imperishableNight", jacket: imperishableNight },
  { songId: "battleNo1", jacket: battleNo1 },
  { songId: "spica", jacket: spica },
  { songId: "weGonnaJourney", jacket: weGonnaJourney },
  { songId: "blazingStorm", jacket: blazingStorm },
];

const individualChallengersSongs: SongWithJacket[] = [
  { songId: "wakeUpDreamer", jacket: wakeUpDreamer },
  { songId: "chaos", jacket: chaos },
  { songId: "pygmalion", jacket: pygmalion },
];

const generateColumns = (songs: Song[]): ColumnsType<Standing> => [
  {
    title: "#",
    key: "no",
    dataIndex: "no",
    render: (_text: string, _record: Standing, idx: number) => idx + 1,
  },
  {
    title: "IGN",
    key: "ign",
    dataIndex: "ign",
    render: (_text: string, { ign, isDisqualified }: Standing) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {ign}
        {isDisqualified && <Tag color="magenta">DQ</Tag>}
      </div>
    ),
  },
  ...songs.map(({ title, image }, idx) => ({
    title: (
      <Image
        src={image}
        alt={title}
        title={title}
        style={{
          maxHeight: "90px",
          height: "auto",
          width: "auto",
        }}
      />
    ),
    children: [
      {
        title: <div style={{ whiteSpace: "pre-line" }}>{title}</div>,
        key: `song${idx + 1}`,
        dataIndex: `song${idx + 1}`,
        render: (_text: string, record: Standing) => {
          const songScore = record[
            `song${idx + 1}` as keyof Standing
          ] as SongScore;
          return <SongScoreLabel songScore={songScore} />;
        },
      },
    ],
  })),
  {
    title: "Total Score",
    key: "totalScore",
    dataIndex: "totalScore",
    render: formatScore,
  },
  {
    title: "Time of play",
    key: "timestamp",
    dataIndex: "timestamp",
    render: (_text: string, record: Standing) =>
      formatTimestamp(record.timestamp),
  },
];

const LeaderboardTable = styled(Table<Standing>)`
  .masters-finalist {
    background-color: #f0e9f5;
  }

  .challengers-finalist {
    background-color: #f5f0f0;
  }

  .disqualified {
    background-color: #ccc;
  }
`;

const Leaderboard = () => {
  const [shouldHideDisqualified, setShouldHideDisqualified] = useState(true);
  const [shouldHideFinalists, setShouldHideFinalists] = useState(false);

  const [masterStandings, setMasterStandings] = useState<Standing[]>([]);
  const [challengerStandings, setChallengerStandings] = useState<Standing[]>(
    []
  );

  const [individualSongStandings, setIndividualSongStandings] = useState<
    IndividualSongStanding[]
  >([]);
  const [isFetchingStandings, setIsFetchingStandings] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const fetchStandings = useCallback(async () => {
    setIsFetchingStandings(true);
    const response = await fetch("/submissions");
    const {
      masters,
      challengers,
      individualSongStandings: responseIndividualSongStandings,
    } = await response.json();

    setChallengerStandings(challengers);
    setMasterStandings(masters);
    setIndividualSongStandings(responseIndividualSongStandings);
    setIsFetchingStandings(false);
  }, []);

  useEffect(() => {
    fetchStandings().catch(console.error);
  }, [fetchStandings]);

  const table = (
    songs: Song[],
    scores: Standing[],
    division: "masters" | "challengers",
    numFinalists: number
  ) => (
    <LeaderboardTable
      size="small"
      loading={isFetchingStandings}
      columns={generateColumns(songs)}
      dataSource={scores.filter(
        ({ isDisqualified }) => !shouldHideDisqualified || !isDisqualified
      )}
      rowClassName={(record: Standing, index: number) =>
        `${index < numFinalists ? `${division}-finalist ` : ""}${
          record.isDisqualified ? "disqualified " : ""
        }`
      }
      pagination={false}
      rowKey="ign"
      scroll={{ x: true }}
    />
  );

  return (
    <>
      <h1>Leaderboard</h1>
      <p style={{ fontWeight: "bold" }}>Qualifiers time remaining: Ended!</p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flex: "1",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <Switch
              onChange={setShouldHideDisqualified}
              checked={shouldHideDisqualified}
            />
            Hide Disqualified
          </div>
          {(activeTab === "individualMastersSongStandings" ||
            activeTab === "individualChallengersSongStandings") && (
            <div style={{ display: "flex", gap: "8px" }}>
              <Switch
                onChange={setShouldHideFinalists}
                checked={shouldHideFinalists}
              />
              Hide Finalists
            </div>
          )}
        </div>
        <Button
          icon={<RedoOutlined />}
          type="default"
          disabled={isFetchingStandings}
          onClick={fetchStandings}
        >
          Refresh
        </Button>
      </div>
      <Tabs
        style={{ marginTop: "8px" }}
        onChange={setActiveTab}
        defaultActiveKey="masters"
        items={[
          {
            key: "masters",
            label: "Masters",
            children: table(masterSongs, masterStandings, "masters", 8),
          },
          {
            key: "challengers",
            label: "Challengers",
            children: table(
              challengerSongs,
              challengerStandings,
              "challengers",
              16
            ),
          },
          {
            key: "individualMastersSongStandings",
            label: "Individual Songs (Masters)",
            children: (
              <IndividualSongLeaderboard
                songs={individualMastersSongs}
                loading={isFetchingStandings}
                standings={individualSongStandings}
                options={{
                  shouldHideFinalists,
                  shouldHideDisqualified,
                }}
              />
            ),
          },
          {
            key: "individualChallengersSongStandings",
            label: "Individual Songs (Challengers)",
            children: (
              <IndividualSongLeaderboard
                songs={individualChallengersSongs}
                loading={isFetchingStandings}
                standings={individualSongStandings}
                options={{
                  shouldHideFinalists,
                  shouldHideDisqualified,
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default Leaderboard;
