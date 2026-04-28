import { NextResponse } from "next/server"
import { Resend } from "resend"

// Inbox where every contact-form submission is delivered.
const INBOX_EMAIL = "horahaina123@gmail.com"

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 },
      )
    }

    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim()
    const message = String(body.message ?? "").trim()

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name." },
        { status: 400 },
      )
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      )
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Message should be at least 10 characters." },
        { status: 400 },
      )
    }

    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const subject = `New portfolio message from ${name}`

    // Plain-text fallback (used by clients that don't render HTML).
    const text = [
      `New message via portfolio contact form`,
      ``,
      `From:    ${name} <${email}>`,
      `When:    ${createdAt}`,
      `Id:      ${id}`,
      ``,
      `Message`,
      `-------`,
      message,
    ].join("\n")

    const html = `
      <div style="font-family: -apple-system, system-ui, Segoe UI, Roboto, sans-serif; background:#0a0b0a; color:#f5f5f5; padding:32px;">
        <div style="max-width:560px; margin:0 auto; background:#111; border:1px solid #1f2421; border-radius:16px; overflow:hidden;">
          <div style="padding:24px 28px; border-bottom:1px solid #1f2421;">
            <p style="margin:0; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#10b981;">Nischal Rijal · Portfolio</p>
            <h1 style="margin:8px 0 0; font-family: Georgia, serif; font-size:22px; color:#fff;">New contact message</h1>
          </div>
          <div style="padding:24px 28px;">
            <p style="margin:0 0 6px; font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.2em;">From</p>
            <p style="margin:0 0 18px; font-size:15px; color:#fff;">${escapeHtml(name)} &lt;<a href="mailto:${escapeHtml(email)}" style="color:#10b981; text-decoration:none;">${escapeHtml(email)}</a>&gt;</p>

            <p style="margin:0 0 6px; font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.2em;">Message</p>
            <div style="white-space:pre-wrap; font-size:15px; line-height:1.6; color:#e5e7eb; background:#0a0b0a; border:1px solid #1f2421; border-radius:10px; padding:16px;">
${escapeHtml(message)}
            </div>
          </div>
          <div style="padding:14px 28px; border-top:1px solid #1f2421; font-size:11px; color:#6b7280;">
            id ${id} · ${createdAt}
          </div>
        </div>
      </div>
    `

    const apiKey = process.env.RESEND_API_KEY

    if (apiKey) {
      try {
        const resend = new Resend(apiKey)
        const { error } = await resend.emails.send({
          // Resend's shared sandbox sender works without domain setup.
          from: "Portfolio <onboarding@resend.dev>",
          to: [INBOX_EMAIL],
          replyTo: email,
          subject,
          text,
          html,
        })
        if (error) {
          console.log("[v0] resend error:", error)
          return NextResponse.json(
            {
              ok: false,
              error:
                "Email service rejected the message. Please email me directly.",
            },
            { status: 502 },
          )
        }
      } catch (sendErr) {
        console.log("[v0] resend threw:", (sendErr as Error).message)
        return NextResponse.json(
          {
            ok: false,
            error:
              "Couldn't deliver the message right now. Please email me directly.",
          },
          { status: 502 },
        )
      }
    } else {
      // Graceful local/dev fallback — log so the message isn't lost.
      console.log("[v0] RESEND_API_KEY not set. Message intended for", INBOX_EMAIL, {
        id,
        name,
        email,
        message,
        createdAt,
      })
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks — your message is on its way to me.",
      id,
    })
  } catch (err) {
    console.log("[v0] /api/contact error:", (err as Error).message)
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 },
    )
  }
}
