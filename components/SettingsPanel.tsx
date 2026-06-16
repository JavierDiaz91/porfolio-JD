"use client"

import { useState, useEffect } from "react"
import { 
  Palette,
  Globe,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 🎨 Mapa global de colores para actualizar las variables CSS en tiempo real
const COLOR_MAP: Record<string, string> = {
  cyan: '0 240 255',
  violet: '139 92 246',
  emerald: '16 185 129',
  amber: '245 158 11',
  rose: '244 63 94'
}

export function SettingsPanel() {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [siteTitle, setSiteTitle] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("portfolio_site_title") || "Javier Diaz | Full Stack Developer"
    return "Javier Diaz | Full Stack Developer"
  })

  const [siteDesc, setSiteDesc] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("portfolio_site_desc") || "Desarrollador Full Stack especializado en Backend .NET y Frontend Next.js"
    return "Desarrollador Full Stack especializado en Backend .NET y Frontend Next.js"
  })

  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("portfolio_accent_color") || "cyan"
    return "cyan"
  })

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio_animations")
      return saved !== null ? saved === "true" : true
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTitle = localStorage.getItem("portfolio_site_title")
      const savedDesc = localStorage.getItem("portfolio_site_desc")
      const savedColor = localStorage.getItem("portfolio_accent_color")
      const savedAnims = localStorage.getItem("portfolio_animations")

      if (savedTitle) setSiteTitle(savedTitle)
      if (savedDesc) setSiteDesc(savedDesc)
      if (savedColor) setAccentColor(savedColor)
      if (savedAnims) setAnimationsEnabled(savedAnims === "true")
    }
  }, [])

  // 🛠️ Función auxiliar para forzar la actualización de la variable CSS en el árbol del DOM
  const forceCSSVariableUpdate = (color: string) => {
    const rgbValue = COLOR_MAP[color] || COLOR_MAP.cyan
    document.documentElement.style.setProperty('--accent-color', rgbValue)
  }

  const handleExportData = () => {
    setIsExporting(true)
    
    const data = {
      projects: localStorage.getItem("portfolio_projects"),
      profile: localStorage.getItem("portfolio_profile"),
      site_title: localStorage.getItem("portfolio_site_title"),
      site_desc: localStorage.getItem("portfolio_site_desc"),
      accent_color: localStorage.getItem("portfolio_accent_color"),
      animations: localStorage.getItem("portfolio_animations"),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(false)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 2000)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        
        if (data.projects) localStorage.setItem("portfolio_projects", data.projects)
        if (data.profile) localStorage.setItem("portfolio_profile", data.profile)
        if (data.site_title) localStorage.setItem("portfolio_site_title", data.site_title)
        if (data.site_desc) localStorage.setItem("portfolio_site_desc", data.site_desc)
        if (data.accent_color) localStorage.setItem("portfolio_accent_color", data.accent_color)
        if (data.animations) localStorage.setItem("portfolio_animations", data.animations)

        // Forzamos actualización de estados locales de la vista
        if (data.site_title) setSiteTitle(data.site_title)
        if (data.site_desc) setSiteDesc(data.site_desc)
        if (data.accent_color) {
          setAccentColor(data.accent_color)
          forceCSSVariableUpdate(data.accent_color) // 🚀 Actualiza el color visual al importar
        }
        if (data.animations) setAnimationsEnabled(data.animations === "true")

        window.dispatchEvent(new Event("projectsUpdated"))
        window.dispatchEvent(new Event("profileUpdated"))
        window.dispatchEvent(new Event("settingsUpdated"))
        
        alert("Datos importados correctamente")
      } catch {
        alert("Error al importar los datos. Asegúrate de que el archivo es válido.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleResetData = () => {
    localStorage.removeItem("portfolio_projects")
    localStorage.removeItem("portfolio_profile")
    localStorage.removeItem("portfolio_site_title")
    localStorage.removeItem("portfolio_site_desc")
    localStorage.removeItem("portfolio_accent_color")
    localStorage.removeItem("portfolio_animations")
    
    window.dispatchEvent(new Event("projectsUpdated"))
    window.dispatchEvent(new Event("profileUpdated"))
    window.dispatchEvent(new Event("settingsUpdated"))
    
    setShowResetConfirm(false)
    window.location.reload()
  }

  // Persistencia real de la configuración
  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      localStorage.setItem("portfolio_site_title", siteTitle)
      localStorage.setItem("portfolio_site_desc", siteDesc)
      localStorage.setItem("portfolio_accent_color", accentColor)
      localStorage.setItem("portfolio_animations", String(animationsEnabled))

      // 🚀 Forzamos al HTML a mutar de color y notificamos a todos los componentes
      forceCSSVariableUpdate(accentColor)
      window.dispatchEvent(new Event("settingsUpdated"))

      // Delay estético controlado
      await new Promise((resolve) => setTimeout(resolve, 600)) 

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error("Error al guardar la configuración:", error)
      alert("No se pudieron guardar los cambios.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las preferencias de tu portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan/10">
                <Database className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <CardTitle className="text-lg">Gestión de datos</CardTitle>
                <CardDescription>Exporta, importa o resetea tus datos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {exportSuccess ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                    Exportado
                  </span>
                ) : isExporting ? (
                  <span className="flex items-center justify-center">
                    <span className="block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Exportando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar datos
                  </span>
                )}
              </Button>
              
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar datos
                  </span>
                </Button>
              </label>
            </div>

            <div className="pt-4 border-t border-border">
              <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Resetear todos los datos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      ¿Resetear todos los datos?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos tus proyectos y la información de tu perfil.
                      Los datos por defecto serán restaurados. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sí, resetear todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet/10">
                <Palette className="h-5 w-5 text-violet" />
              </div>
              <div>
                <CardTitle className="text-lg">Apariencia</CardTitle>
                <CardDescription>Personaliza el aspecto de tu portfolio</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Color de acento</Label>
              {/* 🎨 El selector cambia el estado temporal. El guardado se consolida al hacer click abajo en Guardar */}
              <Select value={accentColor} onValueChange={setAccentColor}>
                <SelectTrigger className="mt-1.5 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyan">Cyan (por defecto)</SelectItem>
                  <SelectItem value="violet">Violeta</SelectItem>
                  <SelectItem value="emerald">Esmeralda</SelectItem>
                  <SelectItem value="amber">Ámbar</SelectItem>
                  <SelectItem value="rose">Rosa</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Próximamente: cambio de colores del tema
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label>Animaciones</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Activa o desactiva las animaciones
                </p>
              </div>
              <Switch 
                checked={animationsEnabled} 
                onCheckedChange={setAnimationsEnabled} 
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Globe className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg">SEO y metadatos</CardTitle>
                <CardDescription>Optimiza tu portfolio para buscadores</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteTitle">Título del sitio</Label>
              <Input
                id="siteTitle"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="mt-1.5 bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="siteDesc">Descripción</Label>
              <Input
                id="siteDesc"
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="mt-1.5 bg-secondary border-border"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Próximamente: edición completa de metadatos SEO
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Shield className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Acerca del sistema</CardTitle>
                <CardDescription>Información del panel de administración</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versión</span>
                <span className="text-foreground font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Almacenamiento</span>
                <span className="text-foreground font-medium">LocalStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="text-foreground font-medium">Next.js 16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UI</span>
                <span className="text-foreground font-medium">shadcn/ui + Tailwind</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón de acción inferior */}
      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-5 font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-900/20 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-2">
            {saveSuccess && <CheckCircle className="h-5 w-5 text-white" />}
            
            {isSaving && (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            
            {!isSaving && !saveSuccess && <Save className="h-5 w-5" />}

            <span>
              {saveSuccess ? "¡Cambios guardados!" : isSaving ? "Guardando..." : "Guardar todos los cambios"}
            </span>
          </span>
        </Button>
      </div>
    </div>
  )
}