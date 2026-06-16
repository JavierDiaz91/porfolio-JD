"use client"

import { motion } from "framer-motion"
import { Layout, Globe, MonitorSmartphone, Smartphone } from "lucide-react"

// Cambiamos el enfoque técnico por soluciones comerciales concretas
const services = [
  {
    title: "Landing Pages",
    icon: Layout,
    description: "Páginas de una sola sección optimizadas para capturar clientes, lanzar productos o promocionar servicios. Diseño de alto impacto visual, velocidad de carga premium y conversión asegurada.",
  },
  {
    title: "Aplicaciones Web (Sistemas / SaaS)",
    icon: MonitorSmartphone,
    description: "Plataformas de gestión a medida, paneles de administración (dashboards) y herramientas de automatización en la nube. Desarrollo robusto con bases de datos seguras y flujos eficientes.",
  },
  {
    title: "Sitios Web Corporativos",
    icon: Globe,
    description: "Presencia web institucional completa y escalable para empresas o profesionales. Conectá tus canales de atención, automatizá tus formularios de contacto y posicioná tu marca.",
  },
  {
    title: "Aplicaciones Móviles Android",
    icon: Smartphone,
    description: "Desarrollo nativo moderno para teléfonos inteligentes. Creación de interfaces fluidas con almacenamiento local independiente, sincronización en tiempo real y excelente rendimiento.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function Stack() {
  return (
    <section id="stack" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
        >
          Servicios y Soluciones
        </motion.h2>
        
        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Transformo ideas y necesidades técnicas en productos digitales eficientes, estables y listos para escalar el negocio.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {services.map((service) => {
            const IconComponent = service.icon

            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group relative p-8 rounded-xl bg-card border border-platinum/20 hover:border-bronze/50 transition-all duration-300 flex flex-col justify-between"
                style={{
                  boxShadow: "none",
                }}
                whileHover={{
                  boxShadow: "0 0 40px var(--bronze-glow)",
                  y: -4,
                }}
              >
                <div>
                  {/* Icono con tu estilo actual */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary mb-6 group-hover:bg-bronze/10 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-bronze" />
                  </div>

                  {/* Título del Servicio */}
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-bronze transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Descripción Comercial explicativa */}
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}