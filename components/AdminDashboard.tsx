"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { AdminLayout } from "@/components/AdminLayout" // Tracciona el layout real
import { DashboardOverview } from "@/components/DashboardOverview"
import { ProjectsManager } from "@/components/ProjectsManager"
import { ProfileEditor } from "@/components/ProfileEditor"
import { SettingsPanel } from "@/components/SettingsPanel"

function AdminContent() {
  const searchParams = useSearchParams()
  const section = searchParams.get("section") || "dashboard"

  const activeSection = (["dashboard", "projects", "profile", "settings"].includes(section) 
    ? section 
    : "dashboard") as "dashboard" | "projects" | "profile" | "settings"

  return (
    <AdminLayout activeSection={activeSection}>
      {activeSection === "dashboard" && <DashboardOverview />}
      {activeSection === "projects" && <ProjectsManager />}
      {activeSection === "profile" && <ProfileEditor />}
      {activeSection === "settings" && <SettingsPanel />}
    </AdminLayout>
  )
}

// Exportamos la estructura principal envuelta en Suspense para Next.js 14/15
export function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  )
}