export const allSongIds = ['unknown1', 'unknown2', 'unknown3'] as const;

const allGenres = ['variety', 'original', 'niconico'] as const;

export type SongId = (typeof allSongIds)[number];
export type Genre = (typeof allGenres)[number];

export interface SongDetails {
  title: string;
  genre: Genre;
}

export const songDetails: Record<SongId, SongDetails> = {
  unknown1: { title: '???', genre: 'niconico' },
  unknown2: { title: '???', genre: 'original' },
  unknown3: { title: '???', genre: 'variety' },
};

export interface SongWithJacket {
  songId: SongId;
  jacket: string; // Image
}
