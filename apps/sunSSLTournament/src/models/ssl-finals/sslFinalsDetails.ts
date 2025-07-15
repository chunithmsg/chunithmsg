import { GrandFinalsMatch } from './grandFinalsMatch';
import { ScoreAttackPhase } from './scoreAttackPhase';
import { TeamDetails } from './teamDetails';
import { TeamMatch } from './teamMatch';
import { TeamPhaseResult } from './teamPhaseResult';

export type SslFinalsDetails = {
  scoreAttackPhase: ScoreAttackPhase;
  teamDetails: TeamDetails;

  // Chronological order.
  // Earliest match at the start.
  //
  // Will only contain matches that have concluded.
  // i.e. It starts as an empty array.
  teamPhaseMatches: TeamMatch[];

  // Ordered by rank.
  // 1st place team at the start
  teamPhaseResults: TeamPhaseResult[];

  // Chronological order.
  // Earliest match at the start.
  //
  // Will only contain matches that have started.
  grandFinalsMatches: GrandFinalsMatch[];
};
