import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { ADMIN_COOKIE } from "@/lib/server/auth"

export const runtime = "nodejs"

function apiBase(): string {
  return (
    process.env.BACKEND_API_URL ??
    "https://api.mmcrt.com/api/v1"
  ).replace(/\/$/, "")
}

function requestIsSecure(request: NextRequest): boolean {
  return (
    request.headers.get("x-forwarded-proto") === "https" ||
    request.nextUrl.protocol === "https:"
  )
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  if (token) {
    try {
      await fetch(`${apiBase()}/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
    } catch {
      // Clear local session even if backend logout is temporarily unavailable.
    }
  }

  const response = NextResponse.json({
    success: true,
  })

  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: requestIsSecure(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
