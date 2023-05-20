import { IndividualSongStanding } from "@/models/individualSongStanding";
import { SongId, songDetails } from "@/utils/songUtils";
import { Table, Tag } from "antd";
import { ColumnGroupType, ColumnType, ColumnsType } from "antd/es/table";
import styled from "styled-components";
import Image from "next/image";
import SongScoreLabel from "./SongScoreLabel";
import {
  formatOrdinal,
  formatTimestamp,
} from "@/utils/leaderboardFrontendUtils";
import {
  filterIndividualScoreStandings,
  isFinalist,
} from "@/utils/leaderboardUtils";

export interface IndividualSongLeaderboardProps
  extends React.ComponentProps<typeof Table> {
  songs: Song[];
  standings: IndividualSongStanding[];
  options?: {
    shouldHideDisqualified?: boolean;
    shouldHideFinalists?: boolean;
  };
}

const LeaderboardTable = styled(Table<IndividualSongStanding>)`
  .disqualified {
    background-color: #ccc;
  }
`;

export interface Song {
  songId: SongId;
  jacket: any;
}

const createColumnFromSong = ({
  songId,
  jacket,
}: Song):
  | ColumnGroupType<IndividualSongStanding>
  | ColumnType<IndividualSongStanding> => {
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
        key: songId,
        dataIndex: ["scoreMap", songId],
        render: (_text: string, record: IndividualSongStanding) => {
          const individualSongScore = record.scoreMap[songId];
          if (!individualSongScore) {
            return <></>;
          }

          const {
            timestamp,
            ign,
            leaderboardStanding,
            songScore,
            isDisqualified,
          } = individualSongScore;

          const isChallengersFinalist =
            isFinalist(leaderboardStanding) &&
            leaderboardStanding?.division === "Challengers";

          const isMastersFinalist =
            isFinalist(leaderboardStanding) &&
            leaderboardStanding?.division === "Masters";

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "6px",
                paddingRight: "6px",
                ...(isDisqualified && { background: "#ddd" }),
                ...(isMastersFinalist && { background: "#f0e9f5" }),
                ...(isChallengersFinalist && { background: "#f5f0f0" }),
              }}
            >
              <div
                style={{
                  paddingTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {ign}
                {leaderboardStanding && isFinalist(leaderboardStanding) && (
                  <Tag
                    color={
                      leaderboardStanding.division === "Challengers"
                        ? "red"
                        : "purple"
                    }
                  >{`${leaderboardStanding.division} ${formatOrdinal(
                    leaderboardStanding.rank
                  )}`}</Tag>
                )}
                {isDisqualified && <Tag color="magenta">DQ</Tag>}
              </div>
              {formatTimestamp(timestamp)}
              <SongScoreLabel songScore={songScore} />
            </div>
          );
        },
      },
    ],
  };
};

const IndividualSongLeaderboard = ({
  songs,
  loading,
  standings,
  options,
}: IndividualSongLeaderboardProps) => {
  const columns: ColumnsType<IndividualSongStanding> = [
    {
      title: "Rank",
      key: "rank",
      dataIndex: "rank",
      render: (_text: string, _record: IndividualSongStanding, idx: number) =>
        idx + 1,
    },
    ...songs.map(createColumnFromSong),
  ];

  const filteredStandings = filterIndividualScoreStandings(standings, {
    shouldFilterDisqualified: options?.shouldHideDisqualified,
    shouldFilterFinalists: options?.shouldHideFinalists,
  });

  return (
    <LeaderboardTable
      size="small"
      columns={columns}
      pagination={false}
      loading={loading}
      dataSource={filteredStandings}
      rowKey="key"
    />
  );
};

IndividualSongLeaderboard.displayName = "individualSongLeaderboard";
export default IndividualSongLeaderboard;
