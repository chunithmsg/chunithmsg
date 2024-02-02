import type { Score } from '@/models/standing';

export const getLeaderboard = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient();
  let { data }: { data: Array<Score> | null } = await supabase
    .from('scores')
    .select('*')
    .order('total_score', { ascending: false })
    .order('played_at', { ascending: true })
    .eq('competition_id', competitionId)
    .is('active', true)
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
  ).createClientComponentClient();
  const { data } = await supabase
    .from('competitions')
    .select('id, name')
    .filter('active', 'eq', true);
  return data;
};

export const getScores = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient();
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
  ).createClientComponentClient();
  const { data } = await supabase
    .from('scores')
    .select('*')
    .eq('competition_id', competitionId)
    .eq('id', scoreId)
    .is('deleted_at', null)
    .single();
  return data;
};
