import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import type { Database } from '@/libs';

export const POST = async (request: NextRequest) => {
  const { title } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase.from('todos').insert({ title }).select();
  return NextResponse.json(data);
};
