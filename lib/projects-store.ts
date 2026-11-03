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
    imageUrl: "",
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
  name: "Javier Diaz",
  title: "Full Stack Developer",
  subtitle: "Backend .NET, Frontend Next.js",
  bio: "Soy desarrollador Full Stack con experiencia en backend .NET y frontend con Next.js. Me especializo en construir aplicaciones eficientes, bien estructuradas y orientadas a resultados. Actualmente estoy desarrollando proyectos personales mientras me formo de forma intensiva para seguir creciendo profesionalmente.",
  email: "contacto@javierdiaz.dev",
  phone: "+34 600 000 000",
  location: "España",
  githubUrl: "https://github.com/javierdiaz",
  linkedinUrl: "https://linkedin.com/in/javierdiaz",
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
    return JSON.parse(stored)
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
