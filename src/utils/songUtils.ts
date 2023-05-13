export type SongId = keyof typeof songId;
export type Genre = "variety" | "original" | "gekimai" | "touhou" | "";

export const songId = {
  // As of right now, the values don't exactly do anything. They're just there.
  valsqotch: "valsqotch",
  imperishableNight: "imperishable_night",
  battleNo1: "battle_no_1",
  spica: "spica",
  weGonnaJourney: "we_gonna_journey",
  blazingStorm: "blazing_storm",
  wakeUpDreamer: "wake_up_dreamer",
  chaos: "chaos",
  pygmalion: "pygmalion",
};

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
