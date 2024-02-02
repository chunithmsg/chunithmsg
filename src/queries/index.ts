import type { Database } from '@/libs';

export const getLeaderboard = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  let { data } = await supabase
    .from('scores')
    .select('*')
    .order('total_score', { ascending: false })
    .order('played_at', { ascending: true })
    .eq('competition_id', competitionId)
    .eq('active', true)
    .is('deleted_at', null);

  if (data !== null && data.length > 0) {
    let hasBeenDisqualified = 0;

    data = data.map((score, index) => {
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

  return data;
};

export const getCompetitions = async () => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase
    .from('competitions')
    .select('*')
    .filter('active', 'eq', true);
  return data;
};

export const getScores = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase
    .from('scores')
    .select('*')
    .eq('competition_id', competitionId)
    .is('deleted_at', null);
  return data;
};

export const getScore = async (competitionId: string, scoreId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase
    .from('scores')
    .select('*')
    .eq('competition_id', competitionId)
    .is('deleted_at', null)
    .eq('id', scoreId)
    .single();
  console.log(data);
  return data;
};
