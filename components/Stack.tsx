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
    title: "JavaScript, TypeScript y desarrollo web",
    icon: Globe,
    description: "Desarrollo de aplicaciones web con JavaScript y TypeScript, utilizando React y Next.js en proyectos como Kivra, RENASER y este portfolio.",
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
    <section id="stack" className="relative pt-10 pb-16 px-6">
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
          Un recorrido que combina sistemas empresariales, herramientas de escritorio y desarrollo web.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
        >
          {services.map((service) => {
            const IconComponent = service.icon

            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group relative flex flex-col gap-5 border-b border-white/[0.08] pb-8 last:border-b-0 md:border-b-0"
                style={{ boxShadow: "none" }}
                whileHover={{
                  boxShadow: "0 0 40px var(--bronze-glow)",
                  y: -4,
                }}
              >
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] group-hover:bg-bronze/10 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-bronze" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-bronze transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-xl">
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
