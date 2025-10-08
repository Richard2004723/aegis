import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// CRITICAL FIX: Make the function ASYNC and AWAIT the cookies() result.
export async function createServerSupabaseClient() {
  // FIX: Await the cookies() function result to correctly resolve the type
  const cookieStore = await cookies() 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Now that cookieStore is resolved, .get() exists.
        get(name: string) {
          return cookieStore.get(name)?.value 
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}