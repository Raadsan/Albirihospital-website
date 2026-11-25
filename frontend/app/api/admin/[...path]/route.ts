import { type NextRequest, NextResponse } from "next/server"
import { adminCookieOptions, adminSessionCookie, fetchAdminBackend, isAdminMutation } from "@/lib/admin-session"

type Context = { params: Promise<{ path: string[] }> }

const pathsByMethod: Record<string, RegExp> = {
  GET: /^(?:appointments|contact|blogs|videos|doctors|leadership)(?:\/[\w-]{1,191})?$/,
  POST: /^(?:blogs|videos|doctors|leadership|upload(?:\/(?:media|multiple))?)$/,
  PATCH: /^(?:auth\/password|(?:appointments|contact)\/[\w-]{1,191}\/status|(?:blogs|videos|doctors|leadership)\/[\w-]{1,191})$/,
  DELETE: /^(?:upload|(?:appointments|contact|blogs|videos|doctors|leadership)\/[\w-]{1,191})$/,
}

const noStore = { "Cache-Control": "private, no-store" }

async function forward(request: NextRequest, context: Context) {
  const token = request.cookies.get(adminSessionCookie)?.value
  if (!token) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401, headers: noStore })
  }

  if (request.method !== "GET" && !isAdminMutation(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403, headers: noStore })
  }

  const { path: segments } = await context.params
  const path = segments.join("/")
  if (segments.some((segment) => segment.includes("/")) || !pathsByMethod[request.method]?.test(path)) {
    return NextResponse.json({ error: "Route not found." }, { status: 404, headers: noStore })
  }

  const headers = new Headers({ Authorization: "Bearer " + token })
  const contentType = request.headers.get("content-type")
  if (contentType) headers.set("Content-Type", contentType)

  try {
    const result = await fetchAdminBackend("/" + path + request.nextUrl.search, {
      method: request.method,
      headers,
      body: request.body,
      duplex: "half",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(120_000)]),
    })
    const response = new NextResponse(result.body, {
      status: result.status,
      headers: { ...noStore, "Content-Type": "application/json" },
    })

    if (result.status === 401 || (path === "auth/password" && result.ok)) {
      response.cookies.set(adminSessionCookie, "", { ...adminCookieOptions, maxAge: 0 })
    }

    return response
  } catch {
    return NextResponse.json({ error: "The hospital service is temporarily unavailable." }, { status: 503, headers: noStore })
  }
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE }
