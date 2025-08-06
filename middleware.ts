import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return Array.from(request.cookies.getAll()).map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookiesList) => {
          cookiesList.forEach(({ name, value, ...options }) => {
            // Update request cookies for the current middleware chain
            request.cookies.set({
              name,
              value,
              ...options,
            })
          })

          // Update response cookies for the browser
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          cookiesList.forEach(({ name, value, ...options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    },
  )

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  if (!session && request.nextUrl.pathname.startsWith("/roast-my-cv")) {
    // Auth required, redirect to login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/roast-my-cv/:path*"],
}