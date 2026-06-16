"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Stack } from "@/components/Stack"
import { Projects } from "@/components/Projects"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { ConsoleGuino } from "@/components/ui/ConsoleGuino"
import { type ProfileData } from "@/lib/projects-store"

export default function HomePage() {
  // Valores iniciales por defecto cargados de manera segura en el cliente
  const [profile, setProfile] = useState<ProfileData>({
    name: "Javier Diaz",
    title: "Javier Diaz | Full Stack Developer",
    subtitle: "Backend .NET, Frontend Next.js",
    bio: "Desarrollador Full Stack especializado en el ecosistema .NET (C#, ASP.NET Core, EF Core) y desarrollo moderno con Next.js, Tailwind CSS y TypeScript.",
    email: "contacto@javierdiaz.dev",
    phone: "",
    location: "Rafaela, Santa Fe, Argentina",
    githubUrl: "https://github.com/javierdiaz",
    linkedinUrl: "https://linkedin.com/in/javierdiaz",
    avatarUrl: "",
    resumeUrl: "",
    available: true,
  })

  // Sincronizador con LocalStorage y eventos globales en tiempo real
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadLocalData = () => {
        // 1. Carga dinámica del perfil
        const savedProfile = localStorage.getItem("portfolio_profile")
        if (savedProfile) {
          try {
            setProfile(JSON.parse(savedProfile))
          } catch (e) {
            console.error("Error al parsear el perfil local", e)
          }
        }

        // 2. Carga dinámica del color de acento e inyección al DOM
        const colorMap: Record<string, string> = {
          cyan: '0 240 255',
          violet: '139 92 246',
          emerald: '16 185 129',
          amber: '245 158 11',
          rose: '244 63 94'
        }
        const savedColor = localStorage.getItem("portfolio_accent_color") || "cyan"
        const rgbValue = colorMap[savedColor] || colorMap.cyan
        document.documentElement.style.setProperty("--accent-color", rgbValue)
      }

      // Ejecución inicial en el montado
      loadLocalData()

      // Escuchadores de eventos globales gatillados desde el Admin panel
      window.addEventListener("profileUpdated", loadLocalData)
      window.addEventListener("settingsUpdated", loadLocalData)

      return () => {
        window.removeEventListener("profileUpdated", loadLocalData)
        window.removeEventListener("settingsUpdated", loadLocalData)
      }
    }
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-accent-dynamic/30">
      <ConsoleGuino />

      <Navbar />
      
      <div id="inicio">
        <Hero profile={profile} />
      </div>
      
      <div id="about">
        <About />
      </div>
      
      <Stack />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}