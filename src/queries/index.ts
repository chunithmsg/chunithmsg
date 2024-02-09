import type { Database } from '@/libs';

export const getLeaderboard = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase.rpc('get_leaderboard', {
    scores_competition_id: competitionId,
  });
  let updatedData = null;

  if (data !== null && data.length > 0) {
    let hasBeenDisqualified = 0;

    updatedData = data.map((score, index) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let qualified_index = index + 1;
      if (score.disqualified) {
        hasBeenDisqualified += 1;
        qualified_index = 0;
      } else {
        qualified_index -= hasBeenDisqualified;
      }

      return {
        ...score,
        qualified_index,
      };
    });
  }

  return updatedData;
};

export const getCompetitions = async () => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase.rpc('get_competitions');

  return data;
};

export const getScores = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase.rpc('get_scores', {
    scores_competition_id: competitionId,
  });

  return data;
};

export const getScore = async (competitionId: string, scoreId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase
    .rpc('get_score', {
      score_competition_id: competitionId,
      score_id: scoreId,
    }).single();

  console.log(data);

  return data;
};
