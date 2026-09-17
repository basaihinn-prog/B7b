"use client"

import {
  FormEvent,
  useState,
} from "react"
import {
  useRouter,
  useSearchParams,
} from "next/navigation"
import {
  Loader2,
  LockKeyhole,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      })

      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        setError(
          payload?.error?.message ??
            "Unable to sign in."
        )
        return
      }

      const requestedRedirect =
        searchParams.get("redirect") || "/dashboard"

      const safeRedirect =
        requestedRedirect.startsWith("/") &&
        !requestedRedirect.startsWith("//")
          ? requestedRedirect
          : "/dashboard"

      router.replace(safeRedirect)
      router.refresh()
    } catch {
      setError(
        "Authentication service is unavailable."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login">
          Username or email
        </Label>

        <Input
          id="login"
          name="login"
          value={login}
          onChange={(event) =>
            setLogin(event.target.value)
          }
          autoComplete="username"
          placeholder="admin"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          autoComplete="current-password"
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LockKeyhole className="size-4" />
        )}

        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
