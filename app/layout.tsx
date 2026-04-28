import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nischal Rijal — Software Engineering Student & Developer",
  description:
    "Personal portfolio of Nischal Rijal — a 2nd year software engineering student from Nepal, building modern web experiences with React, fullstack systems and immersive 3D interfaces.",
  generator: "v0.app",
  keywords: [
    "Nischal Rijal",
    "Nepal Developer",
    "Software Engineering",
    "React",
    "Three.js",
    "Fullstack",
    "Portfolio",
  ],
  authors: [{ name: "Nischal Rijal" }],
  openGraph: {
    title: "Nischal Rijal — Software Engineering Student & Developer",
    description:
      "Building modern web experiences with React, fullstack systems and immersive 3D interfaces.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0B0A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
