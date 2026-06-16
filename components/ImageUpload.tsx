"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [urlInput, setUrlInput] = useState(value)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsLoading(false)
      }
      reader.onerror = () => {
        setError("Error al leer el archivo")
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setError("Error al procesar la imagen")
      setIsLoading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setError("")
    }
  }, [urlInput, onChange])

  const handleRemove = useCallback(() => {
    onChange("")
    setUrlInput("")
  }, [onChange])

  return (
    <div className={className}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload">Subir archivo</TabsTrigger>
          <TabsTrigger value="url">URL externa</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <AnimatePresence mode="wait">
            {value ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                  relative h-48 rounded-lg border-2 border-dashed cursor-pointer
                  transition-all duration-200 flex flex-col items-center justify-center gap-3
                  ${isDragging 
                    ? "border-cyan bg-cyan/10" 
                    : "border-border hover:border-muted-foreground bg-secondary/50"
                  }
                `}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Procesando...</span>
                  </div>
                ) : (
                  <>
                    <div className={`
                      p-3 rounded-full transition-colors
                      ${isDragging ? "bg-cyan/20" : "bg-secondary"}
                    `}>
                      <Upload className={`h-6 w-6 ${isDragging ? "text-cyan" : "text-muted-foreground"}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-foreground font-medium">
                        {isDragging ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG hasta 5MB
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="url" className="mt-0">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="bg-cyan text-primary-foreground hover:bg-cyan/90"
              >
                Aplicar
              </Button>
            </div>

            {value && value.startsWith("http") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={() => setError("No se pudo cargar la imagen")}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {!value && (
              <div className="h-48 rounded-lg border border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Vista previa de la imagen</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
