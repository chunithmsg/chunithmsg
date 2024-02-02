import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/libs';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && req.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (!user && req.nextUrl.pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return res;
};

export const config = {
  matcher: ['/admin/:path*'],
};
