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
