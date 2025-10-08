import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Use a temporary Supabase client to access session/cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options) => {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options) => {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 1. Refresh the session (important for Supabase Auth)
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Protect the Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Now, check the user's role from the public.users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      // Redirect non-admin users to the homepage or a 403 page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. Protect the User Dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for files with extensions,
     * the root path, and authentication paths.
     */
    '/((?!_next|favicon.ico|login|signup|api).*)',
  ],
};