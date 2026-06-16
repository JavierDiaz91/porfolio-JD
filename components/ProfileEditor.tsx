"use client"

import { useState, useEffect } from "react"
import { 
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileText,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ImageUpload"
import { type ProfileData } from "@/lib/projects-store"

export function ProfileEditor() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // 🛠️ Carga inicial perezosa y segura desde LocalStorage para evitar desincronizaciones
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("portfolio_profile")
      
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile))
        } catch {
          // Si el JSON se corrompe, cargamos los datos por defecto de Javier Diaz
          setDefaultProfile()
        }
      } else {
        setDefaultProfile()
      }
    }
  }, [])

  const setDefaultProfile = () => {
    setProfile({
      name: "Javier Diaz",
      title: "Javier Diaz | Full Stack Developer",
      subtitle: "Backend .NET, Frontend Next.js",
      bio: "Desarrollador Full Stack especializado en el ecosistema .NET (C#, ASP.NET Core, EF Core) y desarrollo moderno con Next.js, Tailwind CSS y TypeScript.",
      avatarUrl: "",
      email: "tu@email.com",
      phone: "",
      location: "Rafaela, Santa Fe, Argentina",
      githubUrl: "",
      linkedinUrl: "",
      resumeUrl: "",
      available: true
    })
  }

  // Guardado real en LocalStorage emitiendo un evento global para actualizar el portfolio
  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    
    try {
      // Guardamos la estructura limpia en LocalStorage
      localStorage.setItem("portfolio_profile", JSON.stringify(profile))

      // 🚀 Lanzamos el evento personalizado para que el portfolio público se entere al instante del cambio
      window.dispatchEvent(new Event("profileUpdated"))

      // Delay estético corto controlado
      await new Promise((resolve) => setTimeout(resolve, 600))

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Error al guardar el perfil:", error)
      alert("No se pudieron guardar los cambios localmente.")
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  if (!profile) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Actualiza tu información personal y de contacto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Basic Info */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Foto de perfil</CardTitle>
            <CardDescription>Tu foto aparecerá en el hero de tu portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={profile.avatarUrl}
              onChange={(url) => updateField("avatarUrl", url)}
            />
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Disponible para trabajar</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Muestra un badge de disponibilidad
                  </p>
                </div>
                <Switch
                  checked={profile.available}
                  onCheckedChange={(checked) => updateField("available", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Info */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Información básica</CardTitle>
            <CardDescription>Esta información aparecerá en tu portfolio público</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Título profesional</Label>
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1.5 bg-secondary border-border"
                  placeholder="Full Stack Developer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subtitle">Subtítulo / Especialización</Label>
              <Input
                id="subtitle"
                value={profile.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="mt-1.5 bg-secondary border-border"
                placeholder="Backend .NET, Frontend Next.js"
              />
            </div>

            <div>
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profile.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                className="mt-1.5 bg-secondary border-border resize-none"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Información de contacto</CardTitle>
            <CardDescription>Cómo pueden contactarte los visitantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    placeholder="Teléfono de contacto"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  placeholder="Ciudad, País"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Redes sociales</CardTitle>
            <CardDescription>Enlaces a tus perfiles profesionales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="github">GitHub</Label>
              <div className="relative mt-1.5">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  value={profile.githubUrl}
                  onChange={(e) => updateField("githubUrl", e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  placeholder="https://github.com/usuario"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative mt-1.5">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  value={profile.linkedinUrl}
                  onChange={(e) => updateField("linkedinUrl", e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  placeholder="https://linkedin.com/in/usuario"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="resume">CV / Curriculum</Label>
              <div className="relative mt-1.5">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="resume"
                  value={profile.resumeUrl}
                  onChange={(e) => updateField("resumeUrl", e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  placeholder="URL de tu CV (PDF)"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Vista previa</CardTitle>
          <CardDescription>Así se verá tu información en el portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl bg-secondary/50">
            <div className="w-24 h-24 rounded-full bg-background overflow-hidden shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-xl font-bold text-foreground">{profile.name || "Tu nombre"}</h3>
                {profile.available && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-500 rounded-full">
                    Disponible
                  </span>
                )}
              </div>
              <p className="text-cyan font-medium mt-1">{profile.title || "Tu título"}</p>
              <p className="text-muted-foreground text-sm">{profile.subtitle || "Tu especialización"}</p>
              <p className="text-muted-foreground text-sm mt-3 max-w-xl">
                {profile.bio || "Tu biografía aparecerá aquí..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Guardar Ultra Seguro y Estable para el DOM */}
<div className="flex justify-end pt-4">
  <Button 
    onClick={handleSave}
    disabled={isSaving}
    className="w-full sm:w-auto px-6 py-5 font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-950/20 transition-all duration-200"
  >
    <span className="flex items-center justify-center gap-2">
      {/* Contenedor fijo para el Ícono: React siempre ve un elemento acá, evitando errores de inserción/remoción */}
      <span className="flex items-center justify-center w-5 h-5">
        {isSaving ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : saved ? (
          <CheckCircle className="h-5 w-5 text-white animate-in fade-in zoom-in duration-200" />
        ) : (
          <Save className="h-5 w-5" />
        )}
      </span>
      
      {/* Contenedor fijo para el Texto */}
      <span>
        {isSaving ? "Guardando información..." : saved ? "¡Cambios Guardados!" : "Guardar todos los cambios"}
      </span>
    </span>
  </Button>
</div>
</div>
  )
}