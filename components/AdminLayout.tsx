"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  FolderKanban, 
  User, 
  Settings,
  ArrowLeft,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: "dashboard" | "projects" | "profile" | "settings"
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Proyectos", icon: FolderKanban },
  { id: "profile", label: "Perfil", icon: User },
  { id: "settings", label: "Configuración", icon: Settings },
] as const

export function AdminLayout({ children, activeSection }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn("flex flex-col gap-1", mobile ? "p-2" : "p-3")}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id
        
        return (
          <Link
            key={item.id}
            href={`/admin${item.id === "dashboard" ? "" : `?section=${item.id}`}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-secondary group relative",
              isActive && "bg-bronze/10 text-bronze",
              !isActive && "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isActive ? "text-bronze" : "text-muted-foreground group-hover:text-foreground"
            )} />
            
            <AnimatePresence mode="wait">
              {(!isCollapsed || mobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {isActive && (
              <motion.div
                layoutId={mobile ? "mobile-indicator" : "sidebar-indicator"}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-bronze rounded-r-full"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-border px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                Admin<span className="text-bronze">.</span>
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed ? "" : "rotate-180"
            )} />
          </Button>
        </div>

        {/* Nav */}
        <div className="flex-1 py-4">
          <NavContent />
        </div>

        {/* Back to site */}
        <div className={cn(
          "p-3 border-t border-border",
          isCollapsed && "flex justify-center"
        )}>
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start"
              )}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="ml-2">Volver al sitio</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-card">
              <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <span className="text-lg font-bold text-foreground">
                  Admin<span className="text-bronze">.</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="py-4">
                <NavContent mobile />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al sitio
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <span className="text-lg font-bold text-foreground">
            Admin<span className="text-bronze">.</span>
          </span>

          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
