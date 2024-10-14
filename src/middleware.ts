import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './serverActions/authActions';

export async function middleware(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
}
// Specify which routes this middleware should run on
export const config = {
    matcher: ['/team/:path*', '/api/:path*'],
  };