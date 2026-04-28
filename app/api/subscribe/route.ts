import { NextResponse } from "next/server"

const subscribers = new Set<string>()

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const email = String(body?.email ?? "").trim().toLowerCase()

    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid email." }, { status: 400 })
    }

    if (subscribers.has(email)) {
      return NextResponse.json({ ok: true, message: "You're already subscribed." })
    }

    subscribers.add(email)
    console.log("[v0] new subscriber:", email)

    return NextResponse.json({ ok: true, message: "Subscribed — see you in the next letter." })
  } catch (err) {
    console.log("[v0] /api/subscribe error:", (err as Error).message)
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 })
  }
}
