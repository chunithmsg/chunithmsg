import { Database } from '@/libs';

export const deletePlay = async (id: string) => {
  const supabase = (
    await import('@supabase/auth-helpers-nextjs')
  ).createClientComponentClient<Database>();

  await supabase
    .from('scores')
    .update({ active: false, deleted_at: new Date() })
    .eq('id', id);
};
