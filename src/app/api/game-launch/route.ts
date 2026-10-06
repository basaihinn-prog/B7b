import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedAdmin } from "@/lib/server/auth"

export const runtime = "nodejs"

function gameEngineBase(): URL {
  return new URL(
    (
      process.env.GAME_ENGINE_URL ??
      "https://pgplay.online"
    ).replace(/\/$/, "")
  )
}

function mutationOriginAllowed(request: NextRequest): boolean {
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

export async function POST(request: NextRequest) {
  if (!mutationOriginAllowed(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ORIGIN_FORBIDDEN",
          message: "Cross-origin launch request rejected.",
        },
      },
      { status: 403 }
    )
  }

  const admin = await getAuthenticatedAdmin()

  if (!admin) {
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

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 }
    )
  }

  const slug =
    typeof body === "object" &&
    body !== null &&
    "slug" in body &&
    typeof (body as { slug?: unknown }).slug === "string"
      ? (body as { slug: string }).slug.trim()
      : ""

  if (!/^[A-Za-z0-9_.:-]{1,200}$/.test(slug)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_GAME_SLUG",
          message: "Enter a valid Scoobiedog game slug.",
        },
      },
      { status: 400 }
    )
  }

  const engine = gameEngineBase()
  const target = new URL(
    `/api/play/${encodeURIComponent(slug)}`,
    engine
  )

  try {
    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "manual",
      cache: "no-store",
    })

    if (![301, 302, 303, 307, 308].includes(upstream.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GAME_ENGINE_LAUNCH_FAILED",
            message: `Game engine returned HTTP ${upstream.status} instead of a launch redirect.`,
          },
        },
        { status: 502 }
      )
    }

    const location = upstream.headers.get("location")

    if (!location) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GAME_ENGINE_REDIRECT_MISSING",
            message: "Game engine did not return a launch URL.",
          },
        },
        { status: 502 }
      )
    }

    const launchUrl = new URL(location, target)

    if (
      launchUrl.protocol !== "https:" ||
      launchUrl.origin !== engine.origin ||
      launchUrl.pathname !== "/g"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GAME_ENGINE_REDIRECT_REJECTED",
            message: "Game engine returned an unexpected launch destination.",
          },
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          slug,
          launch_url: launchUrl.toString(),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "GAME_ENGINE_UNAVAILABLE",
          message: "Game engine is unavailable.",
        },
      },
      { status: 502 }
    )
  }
}
