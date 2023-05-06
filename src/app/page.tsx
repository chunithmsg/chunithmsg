"use client";

import { Table, Switch, Tabs } from "antd";
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

const formatScore = (score: string) => parseInt(score).toLocaleString("en-US");

// Ideally, the return type should be ColumnsType<Standing>, but the record
// isn't exactly of the same type. Some information was lost to JSON.
const generateColumns = (songs: Song[]): ColumnsType<any> => [
  {
    title: "No",
    key: "no",
    dataIndex: "no",
    render: (_text: string, _record: any, idx: number) => idx + 1,
  },
  {
    title: "IGN",
    key: "ign",
    dataIndex: "ign",
    render: (text: string, record: any) =>
      `${text}${record.isDisqualified ? " (disqualified)" : ""}`,
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
    dataIndex: `song${idx + 1}`,
    render: formatScore,
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
    render: (_text: string, record: any) =>
      new Date(record.timestamp).toLocaleString(),
  },
];

const StyledTable = styled(Table)`
  .disqualified {
    background-color: #ccc;
  }
`;

const Leaderboard = () => {
  const [hideDisqualified, setHideDisqualified] = useState(true);
  const [masterStandings, setMasterStandings] = useState<Standing[]>([]);
  const [challengerStandings, setChallengerStandings] = useState<Standing[]>(
    []
  );
  const [isFetchingStandings, setIsFetchingStandings] = useState(false);

  const fetchStandings = useCallback(async () => {
    setIsFetchingStandings(true);
    const response = await fetch("/submissions");
    const { masters, challengers } = await response.json();

    setChallengerStandings(challengers);
    setMasterStandings(masters);
    setIsFetchingStandings(false);
  }, []);

  useEffect(() => {
    fetchStandings().catch(console.error);
  }, [fetchStandings]);

  const table = (songs: Song[], scores: Standing[]) => (
    <StyledTable
      loading={isFetchingStandings}
      columns={generateColumns(songs)}
      dataSource={scores.filter(
        ({ isDisqualified }) => !hideDisqualified || !isDisqualified
      )}
      rowClassName={(record: any) => record.isDisqualified && "disqualified"}
      pagination={false}
    />
  );

  return (
    <>
      <h1>Leaderboard</h1>
      <div style={{ display: "flex", gap: "8px" }}>
        <Switch onChange={setHideDisqualified} checked={hideDisqualified} />
        Hide disqualified
      </div>
      <Tabs
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
        ]}
      />
    </>
  );
};

export default Leaderboard;
