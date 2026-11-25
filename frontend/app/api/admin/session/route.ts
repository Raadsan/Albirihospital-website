import { NextResponse } from "next/server"
import { adminCookieOptions, adminSessionCookie, fetchAdminBackend, isAdminMutation } from "@/lib/admin-session"

const noStore = { "Cache-Control": "no-store" }

export async function POST(request: Request) {
  if (!isAdminMutation(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403, headers: noStore })
  }

  let credentials: unknown
  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ error: "Enter your email address and password." }, { status: 400, headers: noStore })
  }

  try {
    const result = await fetchAdminBackend("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    const data = await result.json()
    if (!result.ok) {
      return NextResponse.json(
        { error: data.error ?? "Sign-in failed." },
        { status: result.status, headers: noStore },
      )
    }

    if (typeof data.token !== "string" || !data.token) {
      throw new Error("Missing session")
    }

    const response = NextResponse.json({ success: true }, { headers: noStore })
    response.cookies.set(adminSessionCookie, data.token, adminCookieOptions)
    return response
  } catch {
    return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503, headers: noStore })
  }
}

export function DELETE(request: Request) {
  if (!isAdminMutation(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403, headers: noStore })
  }

  const response = NextResponse.json({ success: true }, { headers: noStore })
  response.cookies.set(adminSessionCookie, "", { ...adminCookieOptions, maxAge: 0 })
  return response
}
