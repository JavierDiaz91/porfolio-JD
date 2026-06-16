"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save,
  Image as ImageIcon,
  Search,
  Filter,
  Star,
  ExternalLink,
  Github,
  GripVertical,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ImageUpload } from "@/components/ImageUpload"
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  type Project 
} from "@/lib/projects-store"

interface ProjectForm {
  title: string
  description: string
  imageUrl: string
  tags: string
  githubUrl: string
  liveUrl: string
  featured: boolean
  status: "published" | "draft"
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  imageUrl: "",
  tags: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  status: "published",
}

export function ProjectsManager() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = () => setProjects(getProjects())
    loadProjects()

    window.addEventListener("projectsUpdated", loadProjects)
    return () => window.removeEventListener("projectsUpdated", loadProjects)
  }, [])

  useEffect(() => {
    const action = searchParams.get("action")
    if (action === "new") {
      openAddModal()
      router.replace("/admin?section=projects", { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    let filtered = [...projects]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        p => p.title.toLowerCase().includes(query) || 
             p.description.toLowerCase().includes(query) ||
             p.tags.some(t => t.toLowerCase().includes(query))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, statusFilter])

  const openAddModal = () => {
    setEditingProject(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      tags: project.tags.join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured,
      status: project.status,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setForm(emptyForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      githubUrl: form.githubUrl.trim() || undefined,
      liveUrl: form.liveUrl.trim() || undefined,
      featured: form.featured,
      status: form.status,
    }

    if (editingProject) {
      updateProject(editingProject.id, projectData)
    } else {
      addProject(projectData)
    }

    setProjects(getProjects())
    closeModal()
  }

  const handleDelete = (id: string) => {
    deleteProject(id)
    setProjects(getProjects())
    setDeleteConfirmId(null)
  }

  const toggleFeatured = (project: Project) => {
    updateProject(project.id, { featured: !project.featured })
    setProjects(getProjects())
  }

  const toggleStatus = (project: Project) => {
    const newStatus = project.status === "published" ? "draft" : "published"
    updateProject(project.id, { status: newStatus })
    setProjects(getProjects())
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los proyectos de tu portfolio
          </p>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-bronze to-bronze-light text-white hover:from-bronze-light hover:to-gold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar proyecto
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === "all" ? "Todos" : statusFilter === "published" ? "Publicados" : "Borradores"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                  Publicados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                  Borradores
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery || statusFilter !== "all" 
                ? "No se encontraron proyectos" 
                : "No hay proyectos todavía"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Intenta con otros filtros de búsqueda"
                : "Comienza agregando tu primer proyecto"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={openAddModal} className="bg-gradient-to-r from-bronze to-bronze-light text-white hover:from-bronze-light hover:to-gold">
                <Plus className="h-4 w-4 mr-2" />
                Agregar proyecto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card border-border hover:border-border/80 transition-all group overflow-hidden">
                  {/* Image */}
                  <div className="relative h-40 bg-secondary overflow-hidden">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditModal(project)}
                            className="h-8 px-2"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setDeleteConfirmId(project.id)}
                            className="h-8 px-2 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="secondary" className="h-8 px-2">
                                <Github className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="secondary" className="h-8 px-2">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant={project.status === "published" ? "default" : "secondary"} className={
                        project.status === "published" 
                          ? "bg-emerald-500/90 hover:bg-emerald-500" 
                          : "bg-amber-500/90 hover:bg-amber-500"
                      }>
                        {project.status === "published" ? "Publicado" : "Borrador"}
                      </Badge>
                    </div>

                    {/* Featured star */}
                    <button
                      onClick={() => toggleFeatured(project)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <Star className={`h-4 w-4 ${project.featured ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          +{project.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.updatedAt).toLocaleDateString("es-ES")}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(project)}
                        className="h-7 text-xs"
                      >
                        {project.status === "published" ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Publicar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Editar proyecto" : "Agregar proyecto"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Imagen del proyecto</Label>
              <ImageUpload
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
              />
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1.5 bg-secondary border-border"
                placeholder="Nombre del proyecto"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1.5 bg-secondary border-border resize-none"
                placeholder="Descripción breve del proyecto"
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tecnologías *</Label>
              <Input
                id="tags"
                required
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="mt-1.5 bg-secondary border-border"
                placeholder="React, TypeScript, Node.js (separadas por comas)"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="githubUrl">URL de GitHub</Label>
                <Input
                  id="githubUrl"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label htmlFor="liveUrl">URL en vivo</Label>
                <Input
                  id="liveUrl"
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                  placeholder="https://miproyecto.com"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
                />
                <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                  <Star className={`h-4 w-4 ${form.featured ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                  Destacar proyecto
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="status"
                  checked={form.status === "published"}
                  onCheckedChange={(checked) => setForm({ ...form, status: checked ? "published" : "draft" })}
                />
                <Label htmlFor="status" className="flex items-center gap-2 cursor-pointer">
                  {form.status === "published" ? (
                    <Eye className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  {form.status === "published" ? "Publicado" : "Borrador"}
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-bronze to-bronze-light text-white hover:from-bronze-light hover:to-gold">
                <Save className="h-4 w-4 mr-2" />
                {editingProject ? "Guardar cambios" : "Agregar proyecto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
