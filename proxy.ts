import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/token';
import { SESSION_COOKIE } from './lib/constants';

// Next.js 16: `middleware.ts` was renamed to `proxy.ts` (runs on Node.js runtime).
// Location: src/proxy.ts  (same level as src/app)
//
// This is only a FAST first gate (cookie + JWT check, no database).
// Real protection still happens in requireAdmin() inside every admin page and Server Action.

const LOGIN_PATH = '/admin/login';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const session = await verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
    const isLoginPage = pathname === LOGIN_PATH;

    // Not logged in -> send to login (except the login page itself)
    if (!session && !isLoginPage) {
        return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }

    // Already logged in -> no need to see the login page
    if (session && isLoginPage) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
