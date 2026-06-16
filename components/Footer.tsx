"use client"

import Link from "next/link"
import { Github, Linkedin, Settings } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-platinum/20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © 2026 Javier Diaz. Todos los derechos reservados.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/JavierDiaz91/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-bronze transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/javier-diaz-225921210/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-bronze transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          
          
          {/* Hidden admin link */}
<Link
  href="/admin"
  className="text-muted-foreground/40 hover:text-bronze transition-colors p-2 -m-2 rounded-md" 
  aria-label="Panel de administración"
  title="Admin"
>
  <Settings className="h-4.5 w-4.5" />
</Link>
        </div>
      </div>
    </footer>
  )
}
