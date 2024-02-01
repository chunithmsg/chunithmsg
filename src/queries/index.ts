export const getLeaderboard = async () => {
  const axios = (await import('@/libs')).axiosClient;
  const { data } = await axios.get('/api/submissions');
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

  console.log(data);
  return data;
};
