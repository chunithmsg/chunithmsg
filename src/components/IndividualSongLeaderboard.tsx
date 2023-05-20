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

export interface IndividualSongLeaderboardProps
  extends React.ComponentProps<typeof Table> {
  songs: Song[];
  dataSource: IndividualSongStanding[];
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
        dataIndex: songId,
        render: (_text: string, record: IndividualSongStanding) => {
          const individualSongScore = record[songId];
          if (!individualSongScore) {
            return <></>;
          }

          const { timestamp, ign, leaderboardStanding, songScore } =
            individualSongScore;

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "14px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {ign}
                {leaderboardStanding && (
                  <Tag color="purple">{`${
                    leaderboardStanding.division
                  } ${formatOrdinal(leaderboardStanding.rank)}`}</Tag>
                )}
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
  dataSource,
}: IndividualSongLeaderboardProps) => {
  const columns: ColumnsType<IndividualSongStanding> = [
    {
      title: "No",
      key: "no",
      dataIndex: "no",
      render: (_text: string, _record: IndividualSongStanding, idx: number) =>
        idx + 1,
    },
    ...songs.map(createColumnFromSong),
  ];

  return (
    <LeaderboardTable
      size="small"
      columns={columns}
      pagination={false}
      loading={loading}
      dataSource={dataSource}
    />
  );
};

IndividualSongLeaderboard.displayName = "individualSongLeaderboard";
export default IndividualSongLeaderboard;
