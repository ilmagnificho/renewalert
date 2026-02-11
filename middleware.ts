import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/navigation';

const intlMiddleware = createMiddleware(routing);

function shouldRunIntl(pathname: string) {
    if (pathname === '/') return true;
    if (pathname === '/en' || pathname === '/ko') return true;
    if (pathname.startsWith('/en/') || pathname.startsWith('/ko/')) return true;
    return false;
}

export async function middleware(request: NextRequest) {
    // 1) Always run auth/session middleware first.
    const authResponse = await updateSession(request);

    // Respect redirects from auth middleware.
    if (authResponse.status >= 300 && authResponse.status < 400) {
        return authResponse;
    }

    // 2) Run intl middleware only on locale-aware routes.
    if (!shouldRunIntl(request.nextUrl.pathname)) {
        return authResponse;
    }

    const intlResponse = intlMiddleware(request);

    // Preserve cookies set by auth middleware.
    authResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value);
    });

    return intlResponse;
}

export const config = {
    matcher: ['/((?!api|_next|.*\..*).*)']
};
