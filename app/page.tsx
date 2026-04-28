import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Marquee } from "@/components/marquee"
import { About } from "@/components/about"
import { Availability } from "@/components/availability"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Playground } from "@/components/playground"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Availability />
      <Skills />
      <Projects />
      <Playground />
      <Contact />
      <Footer />
    </main>
  )
}
