"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "./ProjectCard"
import { getProjects, type Project } from "@/lib/projects-store"

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only show published projects on the public site
    const loadProjects = () => {
      const allProjects = getProjects()
      setProjects(allProjects.filter(p => p.status === "published"))
    }
    
    loadProjects()
    setIsLoading(false)

    // Listen for storage changes (for real-time sync with admin)
    const handleStorage = () => loadProjects()
    window.addEventListener("storage", handleStorage)
    
    // Custom event for same-tab updates
    const handleProjectsUpdate = () => loadProjects()
    window.addEventListener("projectsUpdated", handleProjectsUpdate)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("projectsUpdated", handleProjectsUpdate)
    }
  }, [])

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-12"
        >
          Trabajos destacados.
        </motion.h2>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-border animate-pulse"
              >
                <div className="h-48 bg-secondary" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-secondary rounded" />
                  <div className="h-4 w-full bg-secondary rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-secondary rounded-full" />
                    <div className="h-6 w-20 bg-secondary rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No hay proyectos todavía.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
