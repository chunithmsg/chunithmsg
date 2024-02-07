import type { Database } from '@/libs';

export const getLeaderboard = async (competitionId: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();
  const { data } = await supabase.rpc('get_leaderboard', {
    scores_competition_id: competitionId,
  });

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
