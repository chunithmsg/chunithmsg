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
};
