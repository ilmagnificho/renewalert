import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'ko'],
    defaultLocale: 'ko'
});

export async function middleware(request: NextRequest) {
    // 1. Run Auth Middleware
    // This handles session refresh and protected route redirects
    const response = await updateSession(request);

    // If auth middleware returned a redirect or error, stop here
    if (response.status >= 300 && response.status < 400) {
        return response;
    }

    // 2. Run Intl Middleware
    // This handles locale routing and prefixes
    const intlResponse = intlMiddleware(request);

    // Copy cookies from auth response (session refresh) to intl response
    response.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value);
    });

    return intlResponse;
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
