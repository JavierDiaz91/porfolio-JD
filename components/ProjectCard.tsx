"use client"

import { motion } from "framer-motion"
import { ExternalLink, Code2, Database, Smartphone, Globe, Github, Monitor } from "lucide-react"
import Image from "next/image" // 🚀 Optimización de rendimiento de Next.js
import type { Project } from "@/lib/projects-store"

interface ProjectCardProps {
  project: Project
}

const techIcons: Record<string, React.ElementType> = {
  "C#": Database,
  "ASP.NET Core": Database,
  "SQL Server": Database,
  "Entity Framework": Database,
  "REST API": Globe,
  "REST APIs": Globe,
  "Next.js": Code2,
  "React": Code2,
  "TypeScript": Code2,
  "Tailwind CSS": Code2,
  "Kotlin": Smartphone,
  "Jetpack Compose": Smartphone,
  "Room DB": Database,
  "MVVM": Code2,
  "Prisma": Database,
  "WinForms": Monitor,      // ✨ Agregado para ImpresiónEtiquetasZebra
  "ZPL Language": Code2,   // ✨ Agregado para el lenguaje de Zebra
}

const tagColors: Record<string, string> = {
  "C#": "bg-bronze/20 text-bronze-light border-bronze/30",
  "ASP.NET Core": "bg-bronze/20 text-bronze-light border-bronze/30",
  "SQL Server": "bg-gold/15 text-gold border-gold/30",
  "Entity Framework": "bg-bronze/20 text-bronze-light border-bronze/30",
  "REST API": "bg-gold/15 text-gold border-gold/30",
  "REST APIs": "bg-gold/15 text-gold border-gold/30",
  "JWT": "bg-bronze/20 text-bronze-light border-bronze/30",
  "Next.js": "bg-gold/15 text-gold border-gold/30",
  "React": "bg-gold/15 text-gold border-gold/30",
  "TypeScript": "bg-gold/15 text-gold border-gold/30",
  "Tailwind CSS": "bg-gold/15 text-gold border-gold/30",
  "Kotlin": "bg-bronze/20 text-bronze-light border-bronze/30",
  "Jetpack Compose": "bg-bronze/20 text-bronze-light border-bronze/30",
  "Room DB": "bg-gold/15 text-gold border-gold/30",
  "MVVM": "bg-bronze/20 text-bronze-light border-bronze/30",
  "Prisma": "bg-gold/15 text-gold border-gold/30",
  "WinForms": "bg-bronze/20 text-bronze-light border-bronze/30",    // ✨ Estilo unificado bronce
  "ZPL Language": "bg-gold/15 text-gold border-gold/30",            // ✨ Estilo unificado dorado
  "default": "bg-secondary text-secondary-foreground border-platinum/30",
}

function getTagColor(tag: string): string {
  return tagColors[tag] || tagColors.default
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      // 📱 Ajustado: El hover de elevación y glow pesado ahora solo se activa en Desktop (md) para evitar bugs en pantallas táctiles
      className="group relative overflow-hidden rounded-xl bg-card border border-platinum/20 hover:border-bronze/50 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-[0_0_50px_var(--bronze-glow)]"
    >
      {/* Project Image Container */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill // 🔥 Reemplaza w-full h-full para un escalado responsivo perfecto de tus nuevos renders
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={project.title.includes("Indumentaria")} // Carga prioritaria al primer proyecto visible
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary via-card to-secondary">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-bronze/20" />
              <Code2 className="relative h-16 w-16 text-muted-foreground/50" />
            </div>
            {/* Tech pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-0.5 bg-bronze" />
              <div className="absolute top-4 left-4 w-0.5 h-12 bg-bronze" />
              <div className="absolute bottom-4 right-4 w-16 h-0.5 bg-gold" />
              <div className="absolute bottom-4 right-4 w-0.5 h-10 bg-gold" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-bronze/30 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-gold/30 rounded-full" />
            </div>
          </div>
        )}
        
        {/* Link overlay on hover */}
        {(project.githubUrl || project.liveUrl || project.link) && (
          <div
            className="absolute inset-0 flex items-center justify-center gap-4 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          >
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors text-sm font-medium"
                aria-label={`Ver código de ${project.title}`}
              >
                <Github className="h-4 w-4" />
                Código
              </a>
            )}
            {(project.liveUrl || project.link) && (
              <a
                href={project.liveUrl || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-bronze to-bronze-light text-white hover:from-bronze-light hover:to-gold transition-colors text-sm font-medium"
                aria-label={`Ver proyecto ${project.title}`}
              >
                <ExternalLink className="h-4 w-4" />
                Ver en vivo
              </a>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-bronze transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}