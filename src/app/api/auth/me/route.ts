import { NextResponse } from "next/server"

import { getAuthenticatedAdmin } from "@/lib/server/auth"

export const runtime = "nodejs"

export async function GET() {
  const user = await getAuthenticatedAdmin()

  if (!user) {
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

  return NextResponse.json({
    success: true,
    data: {
      user,
    },
  })
}
