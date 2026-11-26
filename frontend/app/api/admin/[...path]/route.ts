import { type NextRequest, NextResponse } from "next/server"
import { adminCookieOptions, adminSessionCookie, fetchAdminBackend, getAdminUser, isAdminMutation } from "@/lib/admin-session"
import { canAccessDashboard, isDashboardSection } from "@/lib/dashboard-access"

type Context = { params: Promise<{ path: string[] }> }

const pathsByMethod: Record<string, RegExp> = {
  GET: /^(?:auth\/users|(?:appointments|contact|blogs|videos|doctors|leadership)(?:\/[\w-]{1,191})?)$/,
  POST: /^(?:auth\/register|blogs|videos|doctors|leadership|upload(?:\/(?:media|multiple))?)$/,
  PATCH: /^(?:auth\/(?:password|users\/[\w-]{1,191}(?:\/permissions)?)|(?:appointments|contact)\/[\w-]{1,191}\/status|(?:blogs|videos|doctors|leadership)\/[\w-]{1,191})$/,
  DELETE: /^(?:upload|(?:auth\/users|appointments|contact|blogs|videos|doctors|leadership)\/[\w-]{1,191})$/,
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

  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401, headers: noStore })
  }
  if (user.role !== "ADMIN" && path !== "auth/password") {
    const section = path === "upload/media" ? "videos"
      : path === "upload" ? request.nextUrl.searchParams.get("section")
      : segments[0]
    if (request.method === "DELETE" || !isDashboardSection(section) || !canAccessDashboard(user, section)) {
      return NextResponse.json({ error: "You do not have access to this dashboard action." }, { status: 403, headers: noStore })
    }
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
