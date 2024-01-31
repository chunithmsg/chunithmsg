import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};

export const middleware = async (req: NextRequest) => {
  // const session = await getSession({ req });

  // if (!session) {
  //   NextResponse.redirect('/admin/login');
  //   return;
  // }
  
  NextResponse.next();
}