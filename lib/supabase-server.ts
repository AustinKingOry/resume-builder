import { cookies } from "next/headers"
import { createServerClient as createClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"

export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => {
        return cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }))
      },
      setAll: (cookiesList) => {
        try {
          cookiesList.forEach((cookie) => {
            const { name, value, ...options } = cookie
            cookieStore.set({ name, value, ...(options as CookieOptions) })
          })
        } catch (error) {
          // This will be called during SSR rendering, which is expected
          // We can safely ignore this error
        }
      },
    },
  })
}
