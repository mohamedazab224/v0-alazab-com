import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Check for both possible token cookie names
        const accessToken =
          req.cookies.get("sb-access-token")?.value ||
          req.cookies.get("supabase-auth-token")?.value ||
          req.cookies.get("sb-auth-token")?.value

        if (!accessToken) {
          const loginUrl = new URL("/auth/login", req.url)
          loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
          return NextResponse.redirect(loginUrl)
        }

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(accessToken)

        if (error || !user) {
          const loginUrl = new URL("/auth/login", req.url)
          loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
          return NextResponse.redirect(loginUrl)
        }
      } catch (error) {
        console.error("Middleware auth error:", error)
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    } else {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/admin/settings/:path*"],
}
