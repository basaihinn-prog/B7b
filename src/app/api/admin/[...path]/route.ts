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

function mutationOriginAllowed(request: NextRequest): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true
  }

  const origin = request.headers.get("origin")

  if (!origin) {
    return true
  }

  try {
    return new URL(origin).host === request.nextUrl.host
  } catch {
    return false
  }
}

async function proxyAdmin(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!mutationOriginAllowed(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ORIGIN_FORBIDDEN",
          message: "Cross-origin admin mutation rejected.",
        },
      },
      { status: 403 }
    )
  }

  const { path } = await context.params

  if (
    !Array.isArray(path) ||
    path.length === 0 ||
    path.some((segment) => segment === ".." || segment.includes("\\"))
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_ADMIN_PATH",
          message: "Invalid admin API path.",
        },
      },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required.",
        },
      },
      { status: 401 }
    )
  }

  const target = new URL(
    `${apiBase()}/admin/${path.map(encodeURIComponent).join("/")}`
  )

  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value)
  })

  const headers = new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  })

  const incomingContentType = request.headers.get("content-type")

  if (incomingContentType) {
    headers.set("Content-Type", incomingContentType)
  }

  let body: string | undefined

  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.text()
  }

  try {
    const backend = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    })

    const responseBody = await backend.text()

    return new NextResponse(responseBody, {
      status: backend.status,
      headers: {
        "Content-Type":
          backend.headers.get("content-type") ??
          "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: "Backend service unavailable.",
        },
      },
      { status: 502 }
    )
  }
}

export const GET = proxyAdmin
export const POST = proxyAdmin
export const PATCH = proxyAdmin
export const PUT = proxyAdmin
export const DELETE = proxyAdmin