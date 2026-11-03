"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, MapPin, Send, CheckCircle, Copy, ExternalLink, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Control de estados del menú de email
  const [showEmailOptions, setShowEmailOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  const whatsappNumber = "5493492319868" 
  const contactEmail = "jdiazdesarrollo@gmail.com"
  const whatsappMessage = encodeURIComponent("¡Hola Javier! Vi tu portfolio y me gustaría que hablemos sobre un proyecto.")

  // FUNCIÓN ACTUALIZADA: Conexión asíncrona real con el backend de Next.js
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitted(true)
        setFormData({ name: "", email: "", message: "" }) // Limpieza de inputs exitosa
      } else {
        setErrorMessage(data.error || "Algo salió mal al procesar la solicitud.")
      }
    } catch (error) {
      console.error("Error de conexión al enviar formulario:", error)
      setErrorMessage("No se pudo establecer conexión con el servidor. Verifica tu red.")
    } finally {
      setIsSubmitting(false)
      // Ocultar mensaje de éxito después de unos segundos
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(contactEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleGmailWebClick = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=Consulta desde Portfolio Web`
    window.open(gmailUrl, "_blank", "noopener,noreferrer")
  }

  const handleMailtoClick = () => {
    window.location.href = `mailto:${contactEmail}?subject=Consulta desde Portfolio Web`
  }

  return (
    <section id="contact" className="py-24 px-6 bg-black/40 relative overflow-hidden">
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight mb-12"
        >
          Inicia una <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">conversación.</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Izquierda: Información de Contacto Profesional y Segura */}
<motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="space-y-8"
>
  <p className="text-muted-foreground text-lg leading-relaxed">
    ¿Tenés un proyecto en mente o una propuesta técnica? Completá el formulario y me comunicaré con vos a la brevedad. También podés iniciar un chat directo.
  </p>

  <div className="space-y-4 max-w-sm">
    {/* Tarjeta de Disponibilidad o Estado */}
    <div className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Estado Actual</p>
        <p className="text-sm font-medium text-emerald-400">Disponible para futuros trabajos</p>
      </div>
    </div>

    {/* Tarjeta de Ubicación */}
    <div className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
      <div className="w-10 h-10 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-center justify-center">
        <MapPin className="h-5 w-5 text-amber-400" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Ubicación</p>
        <p className="text-sm font-medium text-zinc-300">Rafaela, Santa Fe, Argentina</p>
      </div>
    </div>
  </div>
</motion.div>
          {/* Columna Derecha: Formulario Interactivo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Nombre</label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-950/60 border-zinc-800 focus-visible:ring-amber-500/30 text-zinc-100"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-950/60 border-zinc-800 focus-visible:ring-amber-500/30 text-zinc-100"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Mensaje</label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-zinc-950/60 border-zinc-800 focus-visible:ring-amber-500/30 resize-none min-h-[100px] text-zinc-100"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>
                {/* Contenedor de animaciones para mensajes del formulario */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                {errorMessage}
              </motion.div>
              )}
              </AnimatePresence>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-zinc-950 font-semibold hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.15)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                      Enviando mensaje...
                    </span>
                  ) : submitted ? (
                    <span className="flex items-center gap-2 justify-center">
                      <CheckCircle className="h-4 w-4" />
                      ¡Mensaje enviado con éxito!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 w-full">
                      Enviar mensaje
                      <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-800"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase tracking-wider">O también</span>
                  <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                <Button
                  type="button"
                  asChild
                  className="w-full bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-300 font-medium"
                >
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}