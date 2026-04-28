"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, Check, Loader2, MapPin } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [serverMsg, setServerMsg] = useState<string>("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setServerMsg("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus("error")
        setServerMsg(data.error ?? "Something went wrong.")
        return
      }
      setStatus("success")
      setServerMsg(data.message ?? "Message sent.")
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setStatus("error")
      setServerMsg("Network error. Please try again.")
    }
  }

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left intro */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#10b981]">
              04 — Contact
            </p>
            <h2 className="mt-3 font-serif text-4xl text-balance text-white sm:text-5xl md:text-[56px] md:leading-[1.05]">
              Let’s build something{" "}
              <em className="text-[#10b981]">thoughtful</em> together.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
              I’m open to internships, freelance work and student-friendly
              collaborations. Send a note — I usually reply within a day or two.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href="mailto:horahaina123@gmail.com"
                className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all hover:border-[#10b981]/30"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[#10b981]">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Email
                  </span>
                  <span className="text-sm text-white">
                    horahaina123@gmail.com
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[#10b981]">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Based in
                  </span>
                  <span className="text-sm text-white">Nepal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />

            <div className="space-y-5">
              <FloatingField
                id="name"
                label="Your Name"
                value={name}
                onChange={setName}
                disabled={status === "loading"}
              />
              <FloatingField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                disabled={status === "loading"}
              />
              <FloatingField
                id="message"
                label="Message"
                value={message}
                onChange={setMessage}
                disabled={status === "loading"}
                textarea
              />

              <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-black transition-all hover:bg-[#0ea371] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {status === "success" && <Check className="h-3.5 w-3.5" />}
                  {status !== "loading" && status !== "success" && (
                    <Send className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                  {status === "loading"
                    ? "Sending"
                    : status === "success"
                      ? "Sent"
                      : "Send Message"}
                </button>

                <AnimatePresence mode="wait">
                  {serverMsg && (
                    <motion.p
                      key={serverMsg}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`text-[12px] tracking-wide ${
                        status === "error"
                          ? "text-red-400"
                          : "text-[#10b981]"
                      }`}
                    >
                      {serverMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function FloatingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  disabled,
  textarea,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
  textarea?: boolean
}) {
  const filled = value.length > 0
  const commonClass =
    "peer block w-full rounded-xl border border-white/10 bg-black/30 px-4 pb-3 pt-6 text-sm text-white outline-none transition-all placeholder-transparent focus:border-[#10b981]/50 focus:bg-black/50 focus:ring-2 focus:ring-[#10b981]/20 disabled:opacity-60"

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          rows={5}
          disabled={disabled}
          required
          className={`${commonClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          disabled={disabled}
          required
          className={commonClass}
        />
      )}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 text-[11px] uppercase tracking-[0.22em] transition-all ${
          filled
            ? "top-2 text-[#10b981]"
            : "top-5 text-white/40 peer-focus:top-2 peer-focus:text-[#10b981]"
        }`}
      >
        {label}
      </label>
    </div>
  )
}
