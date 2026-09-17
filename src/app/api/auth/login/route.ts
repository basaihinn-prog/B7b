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
  const forwardedProto = request.headers.get("x-forwarded-proto")

  return (
    forwardedProto === "https" ||
    request.nextUrl.protocol === "https:"
  )
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid request body.",
        },
      },
      { status: 400 }
    )
  }

  try {
    const backend = await fetch(`${apiBase()}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const payload = await backend.json().catch(() => null)

    if (!backend.ok || !payload?.success) {
      return NextResponse.json(
        payload ?? {
          success: false,
          error: {
            code: "LOGIN_FAILED",
            message: "Authentication failed.",
          },
        },
        { status: backend.status || 401 }
      )
    }

    const token = payload?.data?.token
    const user = payload?.data?.user

    if (!token || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_BACKEND_RESPONSE",
            message: "Authentication response is incomplete.",
          },
        },
        { status: 502 }
      )
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Administrator access required.",
          },
        },
        { status: 403 }
      )
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user,
      },
    })

    response.cookies.set({
      name: ADMIN_COOKIE,
      value: token,
      httpOnly: true,
      secure: requestIsSecure(request),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    })

    return response
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: "Authentication service unavailable.",
        },
      },
      { status: 502 }
    )
  }
}
