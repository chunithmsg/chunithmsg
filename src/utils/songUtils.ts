export const allSongIds = [
  "valsqotch",
  "imperishableNight",
  "battleNo1",
  "spica",
  "weGonnaJourney",
  "blazingStorm",
  "wakeUpDreamer",
  "chaos",
  "pygmalion",
  "flames135seconds",
  "viyellasTears",
  "solips",
  "opfer",
  "rhapsodyForTheEnd",
  "azureVixen",
  "question",
  "singularity",
  "pangaea",
  "nokcamellia",
] as const;

const allGenres = ["variety", "original", "gekimai", "touhou", ""] as const;

export type SongId = (typeof allSongIds)[number];
export type Genre = (typeof allGenres)[number];

export interface SongDetails {
  title: string;
  genre: Genre;
}

export const songDetails: { [songId in SongId]: SongDetails } = {
  valsqotch: { title: "Valsqotch", genre: "gekimai" },
  imperishableNight: {
    title: "Imperishable Night 2006\n(2016 Refine)",
    genre: "touhou",
  },
  battleNo1: { title: "BATTLE NO.1", genre: "variety" },
  spica: { title: "スピカの天秤", genre: "original" },
  weGonnaJourney: { title: "We Gonna Journey", genre: "original" },
  blazingStorm: { title: "Blazing:Storm", genre: "original" },
  wakeUpDreamer: { title: "Wake up Dreamer", genre: "original" },
  chaos: { title: "CHAOS", genre: "variety" },
  pygmalion: { title: "ピュグマリオンの咒文", genre: "original" },
  flames135seconds: { title: "封焔の135秒", genre: "original" },
  viyellasTears: { title: "Viyella's Tears", genre: "gekimai" },
  solips: { title: "sølips", genre: "gekimai" },
  opfer: { title: "Opfer", genre: "gekimai" },
  rhapsodyForTheEnd: {
    title: "《破滅》 ～ Rhapsody for The End",
    genre: "original",
  },
  azureVixen: { title: "Λzure Vixen", genre: "original" },
  singularity: { title: "愛のシンギュラリティ", genre: "original" },
  pangaea: { title: "Pangaea", genre: "variety" },
  nokcamellia: { title: "ナイト・オブ・ナイツ\n(かめりあ's“ワンス・アポン・\nア・ナイト”Remix)", genre: "touhou" },
};

export interface SongWithJacket {
  songId: SongId;
  jacket: any; // Image
}
