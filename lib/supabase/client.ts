'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

// Browser-side Supabase client (singleton per tab).
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

let browserClient: ReturnType<typeof createClient> | undefined

export function getSupabaseBrowser() {
  if (!browserClient) browserClient = createClient()
  return browserClient
}
