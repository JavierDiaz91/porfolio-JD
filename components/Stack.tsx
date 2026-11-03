"use client"

import { motion } from "framer-motion"
import { Code2, Database, MonitorSmartphone, Globe } from "lucide-react"

const services = [
  {
    title: "C# y .NET",
    icon: Code2,
    description: "Desarrollo y mantenimiento de sistemas, análisis de requerimientos e intervención en código fuente de aplicaciones empresariales.",
  },
  {
    title: "SQL y bases de datos",
    icon: Database,
    description: "Consultas y modificaciones de datos para diagnosticar incidentes y sostener la continuidad operativa de los sistemas.",
  },
  {
    title: "Aplicaciones Windows",
    icon: MonitorSmartphone,
    description: "Herramientas de escritorio para procesos internos, incluyendo procesamiento de planillas Excel e impresión automatizada de etiquetas ZPL.",
  },
  {
    title: "Desarrollo web",
    icon: Globe,
    description: "Portfolio desarrollado con Next.js, React y TypeScript. Experiencia complementaria en interfaces web y publicación de proyectos en GitHub.",
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
          Tecnologías y experiencia
        </motion.h2>

        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Experiencia en desarrollo y soporte de sistemas, con foco en .NET y soluciones para necesidades operativas reales.
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
                style={{ boxShadow: "none" }}
                whileHover={{
                  boxShadow: "0 0 40px var(--bronze-glow)",
                  y: -4,
                }}
              >
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary mb-6 group-hover:bg-bronze/10 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-bronze" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-bronze transition-colors duration-300">
                    {service.title}
                  </h3>
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
