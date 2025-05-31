import { motion } from "framer-motion";

export default function AboutUs() {
  // Puedes reemplazar estos placeholders con URLs reales de imágenes
  const teamMembers = [
    "https://th.bing.com/th/id/OIP.wxJtOProDO4tefGjPPv7cwHaGE?rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.x8UNRkaTzCW19mHkKpD86QHaLH?rs=1&pid=ImgDetMain",
    "https://randomuser.me/api/portraits/men/35.jpg",
  ];

  return (
    <section id="sobre" className="bg-muted py-20 px-4 text-center">
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Sobre Nosotros
      </motion.h2>

      <motion.p
        className="max-w-2xl mx-auto text-muted-foreground leading-relaxed mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Somos un equipo multidisciplinario comprometido con brindar soluciones dermatológicas mediante tecnología de vanguardia.
        Nuestro enfoque combina inteligencia artificial, experiencia clínica y diseño centrado en el paciente.
      </motion.p>

      <div className="mt-6 flex flex-wrap justify-center gap-8">
        {teamMembers.map((img, idx) => (
          <motion.div
            key={idx}
            className="w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + idx * 0.3 }}
          >
            <img
              src={img}
              alt={`Miembro del equipo ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
