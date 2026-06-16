"use client"

import { motion } from "framer-motion"

export function About() {
  const badges = [
    "Backend C#",
    "Arquitectura Moderna",
    "Código Limpio",
    "Sistemas Mantenibles"
  ];

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden bg-background">
      {/* Luces de fondo premium (Ambient Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Badge superior de sección */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500/90 bg-amber-500/5 border border-amber-500/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Sobre Mí
          </span>
        </motion.div>

        {/* Tarjeta Unificada Principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 p-8 md:p-12 backdrop-blur-xl shadow-2xl text-center"
        >
          {/* Sutil línea brillante superior */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Título de Impacto */}
          <h2 className="text-3xl md:text-4.5xl font-black text-white tracking-tight leading-none mb-6 text-balance">
            Desarrollo soluciones{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              prácticas y bien estructuradas.
            </span>
          </h2>

          {/* Biografía corregida sin duplicados */}
          <div className="max-w-2xl mx-auto space-y-6 text-zinc-400 text-base md:text-lg leading-relaxed font-normal mb-10 text-center">
            <p>
              Como <strong className="text-zinc-100 font-semibold">Técnico Superior en Desarrollo de Software</strong>, me apasiona diseñar componentes del lado del servidor robustos, limpios y eficientes. ✨
            </p>
            <p>
              Mi especialización se centra en el ecosistema de <strong className="text-amber-500 font-semibold">.NET y C#</strong>, creando APIs REST funcionales y arquitecturas web que priorizan la mantenibilidad en producción.
            </p>
            <p>
              Mi objetivo es transformar requerimientos complejos en código altamente legible, aplicando buenas prácticas y patrones de diseño para asegurar soluciones escalables a largo plazo.
            </p>
          </div>

          {/* Línea Divisoria Atenuada */}
          <div className="w-24 h-[1px] bg-zinc-800 mx-auto mb-8" />

          {/* Badges estilizados al estilo del Stack */}
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="text-xs font-medium px-4 py-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 text-zinc-300 shadow-sm hover:border-amber-500/40 transition-colors duration-300"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 animate-pulse" />
                {badge}
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}

// Exportación por defecto para asegurar compatibilidad limpia
export default About;