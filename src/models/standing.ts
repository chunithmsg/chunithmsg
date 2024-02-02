export const SongStatus = {
  AJC: 'AJC',
  AJ: 'AJ',
  FC: 'FC',
} as const;

export type SongStatusType = (typeof SongStatus)[keyof typeof SongStatus];

/**
 * Future Standing type, named as Score to maintain backwards compatibility.
 */
export type Score = {
  id: string;
  competition_id: string;
  active: boolean;
  disqualified: boolean;
  ign: string;
  song1: number;
  song1_type: SongStatusType;
  song2: number;
  song2_type: SongStatusType;
  song3: number;
  song3_type: SongStatusType;
  total_score: number;
  played_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  qualified_index?: number;
};
