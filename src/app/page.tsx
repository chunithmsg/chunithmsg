"use client";

import { Table, Switch, Tabs } from "antd";
import Image from "next/image";
import unknownSong from "../../public/question.png";
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
import { useState } from "react";

interface Song {
  image: any;
  title: string;
  genre?: Genre;
}

type Genre = "variety" | "original" | "gekimai" | "touhou" | "";

const genreBorderColours: { [key in Genre]: string } = {
  variety: "#00ff00",
  original: "#bd2a1a",
  gekimai: "#ffff00",
  touhou: "#3862b4",
  "": "#ffffff",
};

const challengerSongs: Song[] = [
  { image: wakeUpDreamer, title: "Wake up Dreamer", genre: "original" },
  { image: chaos, title: "CHAOS", genre: "variety" },
  { image: pygmalion, title: "ピュグマリオンの咒文", genre: "original" },
];

const masterSongs: Song[] = [
  { image: valsqotch, title: "Valsqotch", genre: "gekimai" },
  {
    image: imperishableNight,
    title: "Imperishable Night 2006 (2016 Refine)",
    genre: "touhou",
  },
  { image: battleNo1, title: "BATTLE NO.1", genre: "variety" },
  { image: spica, title: "スピカの天秤", genre: "original" },
  { image: weGonnaJourney, title: "We Gonna Journey", genre: "original" },
  { image: blazingStorm, title: "Blazing:Storm", genre: "original" },
];

const generateColumns = (songs: Song[]) =>
  [
    {
      title: "No",
      key: "no",
      render: (_text: string, _record: any, idx: number) => idx + 1,
    },
    {
      title: "ID",
      key: "id",
      render: (text: string, record: any) =>
        `${text}${record.disqualified && " (disqualified)"}`,
    },
    ...songs.map(({ title, image, genre }, idx) => ({
      title: (
        <>
          <Image
            src={image}
            alt=""
            style={{
              border: `4px solid ${genreBorderColours[genre ?? ""]}`,
              maxHeight: "120px",
              height: "auto",
              width: "auto",
            }}
          />
          <div>{title}</div>
        </>
      ),
      key: `song${idx + 1}`,
    })),
    {
      title: "Total",
      key: "total",
      render: (_text: string, record: any) =>
        Object.entries(record).reduce(
          (accumulate, [k, v]) =>
            accumulate + ((k.startsWith("song") ? v : 0) as number),
          0
        ),
    },
  ].map((d) => ({ ...d, dataIndex: d.key }));

const challengerScores: any[] = [];

const masterScores: any[] = [{
  song1: 1006411,
  song2: 1006607,
  song3: 1004832,
  song4: 1007043,
  song5: 1007653,
  song6: 1003465,
  id: "Xantho",
  disqualified: true,
}];

const StyledTable = styled(Table)`
  .disqualified {
    background-color: #ccc;
  }
`;

const Leaderboard = () => {
  const [hideDisqualified, setHideDisqualified] = useState(false);

  const table = (songs: any[], scores: any[]) => (
    <StyledTable
      columns={generateColumns(songs)}
      dataSource={scores
        .sort(
          (a: any, b: any) =>
            a.song1 + a.song2 + a.song3 - b.song1 - b.song2 - b.song3
        )
        .filter(({ disqualified }) => !hideDisqualified || !disqualified)}
      rowClassName={(record: any) => record.disqualified && "disqualified"}
      pagination={false}
    />
  );

  return (
    <>
      <h1>Leaderboard</h1>
      <div style={{ display: "flex", gap: "8px" }}>
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
