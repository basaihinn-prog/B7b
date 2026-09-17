import { NextRequest, NextResponse } from "next/server"

const ADMIN_COOKIE = "ahmed_admin_token"

const protectedRoutes = [
  "/dashboard",
  "/agents",
  "/players",
  "/wallets",
  "/transactions",
  "/providers",
  "/games",
  "/sessions",
  "/audit-logs",
  "/system",
]

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)

    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${request.nextUrl.search}`
    )

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agents/:path*",
    "/players/:path*",
    "/wallets/:path*",
    "/transactions/:path*",
    "/providers/:path*",
    "/games/:path*",
    "/sessions/:path*",
    "/audit-logs/:path*",
    "/system/:path*",
  ],
}
