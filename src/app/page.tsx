"use client";

import { Table, Switch, Tabs, Button, Tag } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import Image from "next/image";

import wakeUpDreamer from "../../public/wakeupdreamer.png";
import chaos from "../../public/chaos.png";
import pygmalion from "../../public/pygmalion.png";
import valsqotch from "../../public/valsqotch.png";
import imperishableNight from "../../public/imperishablenight.png";
import battleNo1 from "../../public/battleno1.png";
import spica from "../../public/spica.png";
import weGonnaJourney from "../../public/wegonnajourney.png";
import blazingStorm from "../../public/blazingstorm.png";

import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Standing } from "@/models/standing";
import { ColumnsType } from "antd/es/table";
import { SongScore } from "@/models/songScore";
import { IndividualSongStanding } from "@/models/individualSongStanding";
import IndividualSongLeaderboard, {
  Song as TempSong,
} from "@/components/IndividualSongLeaderboard";

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

const individualSongs: TempSong[] = [
  { songId: "wakeUpDreamer", jacket: wakeUpDreamer },
  { songId: "chaos", jacket: chaos },
  { songId: "pygmalion", jacket: pygmalion },
  { songId: "valsqotch", jacket: valsqotch },
  { songId: "imperishableNight", jacket: imperishableNight },
  { songId: "battleNo1", jacket: battleNo1 },
  { songId: "spica", jacket: spica },
  { songId: "weGonnaJourney", jacket: weGonnaJourney },
  { songId: "blazingStorm", jacket: blazingStorm },
];

/**
 * Formats the given score using the "en-US" locale.
 *
 * @param score The score to format, given as the string representation of an integer.
 * @returns The formatted score.
 */
const formatScore = (score: number) => score.toLocaleString("en-US");

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  });

const generateColumns = (songs: Song[]): ColumnsType<Standing> => [
  {
    title: "No",
    key: "no",
    dataIndex: "no",
    render: (_text: string, _record: Standing, idx: number) => idx + 1,
  },
  {
    title: "IGN",
    key: "ign",
    dataIndex: "ign",
    render: (text: string, record: Standing) =>
      `${text}${record.isDisqualified ? " (disqualified)" : ""}`,
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
          const { score, ajFcStatus } = record[
            `song${idx + 1}` as keyof Standing
          ] as SongScore;
          return (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <p>{formatScore(score)}</p>
              {ajFcStatus == "AJ" && <Tag color="gold">AJ</Tag>}
              {ajFcStatus == "FC" && <Tag color="green">FC</Tag>}
            </div>
          );
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
    render: (_text: string, record: Standing) => formatDate(record.timestamp),
  },
];

const LeaderboardTable = styled(Table<Standing>)`
  .disqualified {
    background-color: #ccc;
  }
`;

const Leaderboard = () => {
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<
    number | undefined
  >(undefined);
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
    const { masters, challengers, individualSongStandings } =
      await response.json();

    setChallengerStandings(challengers);
    setMasterStandings(masters);
    setIndividualSongStandings(individualSongStandings);
    setIsFetchingStandings(false);
    setLastFetchTimestamp(Date.now());
  }, []);

  useEffect(() => {
    fetchStandings().catch(console.error);
  }, [fetchStandings]);

  const table = (songs: Song[], scores: Standing[]) => (
    <LeaderboardTable
      size="small"
      loading={isFetchingStandings}
      columns={generateColumns(songs)}
      dataSource={scores.filter(
        ({ isDisqualified }) => !shouldHideDisqualified || !isDisqualified
      )}
      rowClassName={(record: any) => record.isDisqualified && "disqualified"}
      pagination={false}
      rowKey={"ign"}
    />
  );

  return (
    <>
      <h1>Leaderboard</h1>
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
            {"Hide Disqualified"}
          </div>
          {activeTab === "individualSongStandings" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <Switch
                onChange={setShouldHideFinalists}
                checked={shouldHideFinalists}
              />
              {"Hide Finalists"}
            </div>
          )}
        </div>
        <Button
          icon={<RedoOutlined />}
          type="default"
          disabled={isFetchingStandings}
          onClick={() => fetchStandings()}
        >
          Refresh
        </Button>
      </div>
      <div style={{ marginTop: "8px", marginBottom: "8px" }}>
        {`Last updated: ${
          lastFetchTimestamp
            ? new Date(lastFetchTimestamp).toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
              })
            : "----"
        }`}
      </div>
      <Tabs
        onChange={setActiveTab}
        defaultActiveKey="masters"
        items={[
          {
            key: "masters",
            label: "Masters",
            children: table(masterSongs, masterStandings),
          },
          {
            key: "challengers",
            label: "Challengers",
            children: table(challengerSongs, challengerStandings),
          },
          {
            key: "individualSongStandings",
            label: "Individual Songs",
            children: (
              <IndividualSongLeaderboard
                songs={individualSongs}
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
