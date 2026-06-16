"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  FolderKanban, 
  Eye, 
  Star,
  TrendingUp,
  Plus,
  ArrowUpRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects, type Project } from "@/lib/projects-store"

interface StatsCardProps {
  title: string
  value: number
  icon: React.ElementType
  trend?: string
  color: string
}

function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardOverview() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const publishedCount = projects.filter(p => p.status === "published").length
  const draftCount = projects.filter(p => p.status === "draft").length
  const featuredCount = projects.filter(p => p.featured).length

  const recentProjects = [...projects]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido al panel de administración de tu portfolio
          </p>
        </div>
        <Link href="/admin?section=projects&action=new">
          <Button className="bg-gradient-to-r from-bronze to-bronze-light text-white hover:from-bronze-light hover:to-gold">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo proyecto
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <StatsCard
            title="Total Proyectos"
            value={projects.length}
            icon={FolderKanban}
            color="bg-bronze"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard
            title="Publicados"
            value={publishedCount}
            icon={Eye}
            color="bg-emerald-500"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="Borradores"
            value={draftCount}
            icon={FolderKanban}
            color="bg-amber-500"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsCard
            title="Destacados"
            value={featuredCount}
            icon={Star}
            color="bg-gold"
          />
        </motion.div>
      </div>

      {/* Recent Projects */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Proyectos recientes</CardTitle>
          <Link href="/admin?section=projects">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-bronze">
              Ver todos
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay proyectos todavía
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 overflow-hidden">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FolderKanban className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.updatedAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === "published" 
                        ? "bg-emerald-500/20 text-emerald-500" 
                        : "bg-amber-500/20 text-amber-500"
                    }`}>
                      {project.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                    {project.featured && (
                      <Star className="h-4 w-4 text-gold fill-gold" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin?section=projects&action=new">
          <Card className="bg-card border-border hover:border-bronze/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-bronze/10 group-hover:bg-bronze/20 transition-colors">
                <Plus className="h-6 w-6 text-bronze" />
              </div>
              <div>
                <p className="font-medium text-foreground">Agregar proyecto</p>
                <p className="text-sm text-muted-foreground">Crea un nuevo proyecto</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin?section=profile">
          <Card className="bg-card border-border hover:border-gold/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
                <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Editar perfil</p>
                <p className="text-sm text-muted-foreground">Actualiza tu información</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/" target="_blank">
          <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Eye className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Ver sitio</p>
                <p className="text-sm text-muted-foreground">Abre tu portfolio público</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
