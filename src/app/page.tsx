"use client";

import { Table, Switch, Tabs, Button, Tag, notification } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import Image from "next/image";

import question from "../../public/question.png";
import nokcamellia from "../../public/sunplustourney/qualifiers/nokcamellia.jpg";
import pangaea from "../../public/sunplustourney/qualifiers/pangaea.jpg";
import singularity from "../../public/sunplustourney/qualifiers/singularityoflove.jpg";

import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Standing } from "@/models/standing";
import { ColumnsType } from "antd/es/table";
import { SongScore } from "@/models/songScore";
import { IndividualSongStanding } from "@/models/individualSongStanding";
import IndividualSongLeaderboard from "@/components/IndividualSongLeaderboard";
import SongScoreLabel from "@/components/SongScoreLabel";
import { SongWithJacket, songDetails } from "@/utils/songUtils";
import {
  leaderboardFreezeEndTimestamp,
  leaderboardFreezeStartTimestamp,
  qualifiersEndTimestamp,
} from "@/utils/constants";
import { formatScore, formatTimestamp } from "@/utils/leaderboardUtils";

const masterSongs: SongWithJacket[] = [
  { songId: "singularity", jacket: singularity },
  { songId: "pangaea", jacket: pangaea },
  { songId: "nokcamellia", jacket: nokcamellia },
];

const individualMastersSongs: SongWithJacket[] = [
  { songId: "singularity", jacket: singularity },
  { songId: "pangaea", jacket: pangaea },
  { songId: "nokcamellia", jacket: nokcamellia },
];

const generateColumns = (songs: SongWithJacket[]): ColumnsType<Standing> => [
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
  ...songs.map(({ songId, jacket }, idx) => {
    const { title } = songDetails[songId];

    return {
      title: (
        <Image
          src={jacket}
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
    };
  }),
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

const formatDuration = (durationInMilliseconds: number) => {
  let tempDuration = Math.floor(durationInMilliseconds / 1000);
  const numSeconds = tempDuration % 60;

  tempDuration = Math.floor(tempDuration / 60);
  const numMinutes = tempDuration % 60;

  tempDuration = Math.floor(tempDuration / 60);
  const numHours = tempDuration % 24;

  tempDuration = Math.floor(tempDuration / 24);
  const numDays = tempDuration;

  return `${numDays}d ${numHours}h ${numMinutes}m ${numSeconds}s`;
};

const LeaderboardTable = styled(Table<Standing>)`
  .masters-finalist {
    background-color: #f0e9f5;
  }

  .disqualified {
    background-color: #ccc;
  }
`;

const Leaderboard = () => {
  const [api, contextHolder] = notification.useNotification();

  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(
    undefined
  );

  const [shouldHideDisqualified, setShouldHideDisqualified] = useState(true);
  const [shouldHideFinalists, setShouldHideFinalists] = useState(false);

  const [masterStandings, setMasterStandings] = useState<Standing[]>([]);

  const [individualSongStandings, setIndividualSongStandings] = useState<
    IndividualSongStanding[]
  >([]);
  const [isFetchingStandings, setIsFetchingStandings] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const fetchStandings = useCallback(async () => {
    setIsFetchingStandings(true);
    const response = await fetch("/submissions");
    const { masters, individualSongStandings } = await response.json();

    setMasterStandings(masters);
    setIndividualSongStandings(individualSongStandings);
    setIsFetchingStandings(false);
  }, []);

  const updateCurrentTimestamp = useCallback(async () => {
    const response = await fetch("/current-time");
    const { unixTimestamp } = await response.json();

    setCurrentTimestamp(unixTimestamp);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateCurrentTimestamp, 250);
    return () => clearInterval(interval);
  }, [updateCurrentTimestamp]);

  useEffect(() => {
    fetchStandings().catch(console.error);
  }, [fetchStandings]);

  const qualifiersRemainingTimeInMilliseconds =
    currentTimestamp === undefined
      ? undefined
      : Math.max(qualifiersEndTimestamp - currentTimestamp, 0);

  const isLeaderboardFrozen =
    currentTimestamp &&
    leaderboardFreezeStartTimestamp <= currentTimestamp &&
    currentTimestamp < leaderboardFreezeEndTimestamp;

  const table = (
    songs: SongWithJacket[],
    scores: Standing[],
    division: "masters",
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
      rowKey={"ign"}
      scroll={{ x: true }}
    />
  );

  return (
    <>
      {contextHolder}
      <h1>Leaderboard</h1>
      <p style={{ fontWeight: "bold" }}>{`Qualifiers time remaining: ${
        qualifiersRemainingTimeInMilliseconds === undefined
          ? "---"
          : qualifiersRemainingTimeInMilliseconds > 0
          ? formatDuration(qualifiersRemainingTimeInMilliseconds)
          : "Ended!"
      }`}</p>
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
          {activeTab === "individualMastersSongStandings" && (
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
          onClick={() => {
            if (isLeaderboardFrozen) {
              api.info({
                message: "Bruh, calm down",
                description:
                  "The leaderboard is still frozen. I promise it'll unfreeze when the qualifiers are over, which should happen soon. Be patient, okay? :›",
                placement: "bottomRight",
                duration: 6,
              });
            }
            fetchStandings();
          }}
        >
          Refresh
        </Button>
      </div>
      {isLeaderboardFrozen && (
        <div
          style={{
            marginTop: "12px",
            marginBottom: "4px",
            fontWeight: "bold",
            fontSize: "large",
            textAlign: "center",
          }}
        >
          The leaderboard is currently frozen
        </div>
      )}
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
        ]}
      />
    </>
  );
};

export default Leaderboard;
