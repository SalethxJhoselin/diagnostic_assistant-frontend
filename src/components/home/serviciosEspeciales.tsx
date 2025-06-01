import { motion } from "framer-motion";
import { UserPlus, Brain, CalendarCheck } from "lucide-react"; // puedes cambiar estos íconos

const servicios = [
  {
    titulo: "Gestión de Pacientes",
    descripcion: "Administra historiales clínicos, tratamientos previos y seguimientos personalizados.",
    detalles: "Incluye alertas automatizadas, historial visual, y sincronización con el calendario de citas.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    titulo: "Diagnósticos IA",
    descripcion: "Asistencia inteligente para diagnósticos precisos mediante modelos de aprendizaje automático.",
    detalles: "Analiza síntomas, imágenes médicas y sugiere diagnósticos compatibles con estándares clínicos.",
    icon: <Brain className="w-8 h-8 text-primary" />,
  },
  {
    titulo: "Citas Médicas",
    descripcion: "Sistema completo para gestión de agendas, reservas, confirmaciones y recordatorios automáticos.",
    detalles: "Integra calendarios, filtros por especialista, y notificaciones para pacientes.",
    icon: <CalendarCheck className="w-8 h-8 text-primary" />,
  },
];

export default function ServiciosPrincipales() {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-12">Servicios Principales de tu Organización</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {servicios.map((servicio, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="p-6 bg-white dark:bg-secondary rounded-xl shadow-md border hover:shadow-xl transition duration-300"
          >
            <div className="h-24 w-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              {servicio.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{servicio.titulo}</h3>
            <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{servicio.detalles}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
