"use client"

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  tags: string[]
  link?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  status: "published" | "draft"
  createdAt: number
  updatedAt: number
}

export interface ProfileData {
  name: string
  title: string
  subtitle: string
  bio: string
  email: string
  phone: string
  location: string
  githubUrl: string
  linkedinUrl: string
  avatarUrl: string
  resumeUrl: string
  available: boolean
}

const PROJECTS_KEY = "portfolio_projects"
const PROFILE_KEY = "portfolio_profile"

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Sistema de control de indumentaria y EPP",
    description: "Sistema desarrollado desde cero para registrar la entrega de indumentaria al personal, actualizar el stock y emitir planillas de Elementos de Protección Personal.",
    imageUrl: "",
    tags: ["Gestión de stock", "EPP", "Reportes"],
    featured: true,
    status: "published",
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
  },
  {
    id: "2",
    title: "Aplicación Windows para impresión de etiquetas",
    description: "Aplicación de escritorio que procesa planillas Excel y automatiza la impresión de etiquetas para impresoras Zebra mediante código ZPL.",
    imageUrl: "/images/impresion-etiquetas-zebra.svg",
    tags: ["WinForms", "Excel", "ZPL"],
    featured: true,
    status: "published",
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 15,
  },
  {
    id: "3",
    title: "Portfolio profesional",
    description: "Sitio personal desarrollado con Next.js, React y TypeScript para presentar experiencia, proyectos y vías de contacto.",
    imageUrl: "",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/JavierDiaz91/porfolio-JD",
    featured: true,
    status: "published",
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
  },
]

const defaultProfile: ProfileData = {
  name: "Javier Díaz",
  title: "Desarrollador de Software | C# y .NET",
  subtitle: "Desarrollo y soporte de sistemas · Rafaela, Santa Fe",
  bio: "Técnico Superior en Desarrollo de Software con experiencia profesional desde 2022 en desarrollo y soporte de sistemas. Trabajo con C# y .NET, bases de datos y herramientas de escritorio para procesos internos. Desarrollé un sistema de control de indumentaria y una aplicación Windows para procesar Excel e imprimir etiquetas ZPL.",
  email: "",
  phone: "",
  location: "Rafaela, Santa Fe, Argentina",
  githubUrl: "https://github.com/JavierDiaz91",
  linkedinUrl: "",
  avatarUrl: "",
  resumeUrl: "",
  available: true,
}

// Projects
export function getProjects(): Project[] {
  if (typeof window === "undefined") return defaultProjects

  const stored = localStorage.getItem(PROJECTS_KEY)
  if (!stored) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects))
    return defaultProjects
  }

  try {
    const projects: Project[] = JSON.parse(stored)
    let migrated = false
    const normalized = projects.map((project) => {
      const isLabelProject = project.title.toLocaleLowerCase().includes("impresión de etiquetas")
      if (isLabelProject && !project.imageUrl) {
        migrated = true
        return { ...project, imageUrl: "/images/impresion-etiquetas-zebra.svg" }
      }
      return project
    })
    if (migrated) localStorage.setItem(PROJECTS_KEY, JSON.stringify(normalized))
    return normalized
  } catch {
    return defaultProjects
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  window.dispatchEvent(new Event("projectsUpdated"))
}

export function addProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const projects = getProjects()
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  projects.unshift(newProject)
  saveProjects(projects)
  return newProject
}

export function updateProject(id: string, updates: Partial<Omit<Project, "id" | "createdAt">>): Project | null {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null

  projects[index] = { ...projects[index], ...updates, updatedAt: Date.now() }
  saveProjects(projects)
  return projects[index]
}

export function deleteProject(id: string): boolean {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false

  saveProjects(filtered)
  return true
}

export function reorderProjects(projectIds: string[]): void {
  const projects = getProjects()
  const reordered = projectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined)
  saveProjects(reordered)
}

// Profile
export function getProfile(): ProfileData {
  if (typeof window === "undefined") return defaultProfile

  const stored = localStorage.getItem(PROFILE_KEY)
  if (!stored) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile))
    return defaultProfile
  }

  try {
    return JSON.parse(stored)
  } catch {
    return defaultProfile
  }
}

export function saveProfile(profile: ProfileData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new Event("profileUpdated"))
}
