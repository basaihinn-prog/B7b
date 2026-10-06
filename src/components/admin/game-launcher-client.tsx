"use client"

import { FormEvent, useState } from "react"
import {
  ExternalLink,
  Gamepad2,
  Loader2,
  Play,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LaunchResponse = {
  success?: boolean
  data?: {
    slug?: string
    launch_url?: string
  }
  error?: {
    code?: string
    message?: string
  }
}

export function GameLauncherClient() {
  const [slug, setSlug] = useState(
    "pragmaticexternal:DwarvenGoldDeluxe"
  )
  const [launchUrl, setLaunchUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function launch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanSlug = slug.trim()

    if (!cleanSlug) {
      setError("Enter a game slug.")
      return
    }

    setLoading(true)
    setError(null)
    setLaunchUrl(null)

    try {
      const response = await fetch("/api/game-launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: cleanSlug }),
        cache: "no-store",
      })

      const payload = (await response.json()) as LaunchResponse

      if (!response.ok || !payload.success || !payload.data?.launch_url) {
        throw new Error(
          payload.error?.message ?? "Unable to create game session."
        )
      }

      setLaunchUrl(payload.data.launch_url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create game session."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Game Launcher
        </h1>
        <p className="text-sm text-muted-foreground">
          Create an authenticated Scoobiedog session through the server-side
          launch bridge and open it without exposing engine configuration in
          browser code.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gamepad2 className="size-4" />
            Launch game
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            className="grid gap-4 lg:grid-cols-[1fr_auto]"
            onSubmit={launch}
          >
            <div className="space-y-2">
              <Label htmlFor="game-slug">
                Scoobiedog game slug
              </Label>
              <Input
                id="game-slug"
                value={slug}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                placeholder="pragmaticexternal:DwarvenGoldDeluxe"
                onChange={(event) => setSlug(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use the exact slug from the 777-dog game catalog.
              </p>
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                Launch
              </Button>
            </div>
          </form>

          {error ? (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {launchUrl ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">
                  Live game session
                </CardTitle>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" />
                  Fresh launch URL generated server-side
                </p>
              </div>

              <Button asChild variant="outline" size="sm">
                <a
                  href={launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
                  Open in new tab
                </a>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-lg border bg-black">
              <iframe
                key={launchUrl}
                src={launchUrl}
                title="Game session"
                className="h-[75vh] min-h-[640px] w-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex min-h-52 items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-2">
              <Gamepad2 className="mx-auto size-8 text-muted-foreground" />
              <p className="font-medium">No active launch</p>
              <p className="text-sm text-muted-foreground">
                Enter an exact game slug and press Launch. The session URL is
                generated only after the authenticated request succeeds.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
