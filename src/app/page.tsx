"use client";

import { Table, Switch, Tabs } from "antd";
import Image from "next/image";
import unknownSong from "../../public/question.png";
import styled from "styled-components";
import { useState } from "react";

const challengerSongs = [
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
];

const masterSongs = [
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
  { image: unknownSong, title: "???" },
];

const generateColumns = (songs) => [
  { title: "No", key: "no", render: (_text, _record, idx) => idx + 1 },
  {
    title: "ID",
    key: "id",
    render: (text, record) =>
      `${text}${record.disqualified && " (disqualified)"}`,
  },
  ...songs.map(({ title, image }, idx) => ({
    title: (
      <>
        <Image src={image} />
        <div>{title}</div>
      </>
    ),
    key: `song${idx + 1}`,
  })),
  {
    title: "Total",
    key: "total",
    render: (_text, record) =>
      Object.entries(record).reduce(
        (accum, [k, v]) => accum + (k.startsWith("song") ? v : 0),
        0
      ),
  },
].map((d) => ({ ...d, dataIndex: d.key }));

const challengerScores = [
  {
    id: "DONJAR",
    song1: 1009999,
    song2: 1008888,
    song3: 1007777,
    disqualified: true,
  },
];

const masterScores = [];

const StyledTable = styled(Table)`
  .disqualified {
    background-color: #ccc;
  }
`;

const Leaderboard = () => {
  const [hideDisqualified, setHideDisqualified] = useState(false);

  const table = (songs, scores) => (
    <StyledTable
      columns={generateColumns(songs)}
      dataSource={scores.sort((a, b) => a.song1 + a.song2 + a.song3 - b.song1 - b.song2 - b.song3).filter(
        ({ disqualified }) => !hideDisqualified || !disqualified
      )}
      rowClassName={(record) => record.disqualified && "disqualified"}
      pagination={false}
    />
  )

  return (
    <>
      <h1>Leaderboard</h1>
      <div>
        <Switch onChange={setHideDisqualified} />
        Hide disqualified
      </div>
      <Tabs
        defaultActiveKey="masters"
        items={[
          {
            key: "masters",
            label: "Masters",
            children: table(masterSongs, masterScores),
          },
          {
            key: "challengers",
            label: "Challengers",
            children: table(challengerSongs, challengerScores),
          },
        ]}
      />
    </>
  );
};

export default Leaderboard;
