"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type ProfileData } from "@/lib/projects-store"

interface HeroProps {
  profile: ProfileData
}

export function Hero({ profile }: HeroProps) {
  // Estado local para forzar el re-render en el cliente cuando cambie el color en tiempo real
  const [accent, setAccent] = useState("cyan")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateAccent = () => {
        const savedColor = localStorage.getItem("portfolio_accent_color") || "cyan"
        setAccent(savedColor)
      }

      updateAccent()
      window.addEventListener("settingsUpdated", updateAccent)
      return () => window.removeEventListener("settingsUpdated", updateAccent)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Fondo con gradiente dinámico usando la variable CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(var(--accent-color),0.08),_transparent_70%)] bg-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Foto de Perfil Dinámica */}
        {profile.avatarUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-accent-dynamic/30 mb-6 shrink-0"            
            style={{ boxShadow: "0 0 30px rgba(var(--accent-color), 0.15)" }}
          >
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Availability Badge Sincronizado */}
        {profile.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-accent-dynamic/30 bg-accent-dynamic/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-dynamic opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-dynamic" />
            </span>
            <span className="text-sm text-accent-dynamic font-medium">Disponible para nuevos proyectos</span>
          </motion.div>
        )}

        {/* Main Title Dinámico con Texto Degradado */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          <span className="text-balance block">{profile.name}</span>
          <span 
            className="block mt-1 bg-gradient-to-r from-stone-300 via-accent-dynamic to-stone-500 bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {profile.title}
          </span>
        </motion.h1>

        {/* Subtitle Dinámico */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl text-balance"
        >
          {profile.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Botón Principal Adaptable */}
          <Button
            size="lg"
            className="bg-accent-dynamic text-black font-semibold hover:opacity-90 transition-all duration-300 group shadow-lg"
            style={{ boxShadow: "0 0 30px rgba(var(--accent-color), 0.2)" }}
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver Proyectos
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Botón Secundario Adaptable */}
          <Button
            size="lg"
            variant="outline"
            className="border-accent-dynamic/40 text-foreground hover:border-accent-dynamic hover:text-accent-dynamic transition-all duration-300"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Contacto
          </Button>
        </motion.div>

        {/* Social Links Dinámicos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-6"
        >
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent-dynamic transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent-dynamic transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  )
}