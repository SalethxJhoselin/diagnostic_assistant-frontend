import { motion } from "framer-motion";

export default function ServiciosDestacados() {
  const servicios = [
    {
      title: "Cáncer De Piel",
      desc: "Evaluación y tratamiento de lunares y lesiones sospechosas con enfoque clínico y tecnología moderna.",
      img: "https://th.bing.com/th/id/OIP.b3UacBHK8bgP-xvk5IIDaAHaEc?rs=1&pid=ImgDetMain",
    },
    {
      title: "Diagnóstico y Tratamiento",
      desc: "Asistencia basada en inteligencia artificial para el diagnóstico y tratamiento de diversas afecciones dermatológicas.",
      img: "https://th.bing.com/th/id/OIP._mPpouXLXkmNdeQhIaSOXAHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: "Historial Clínico",
      desc: "Visualiza el historial completo de tratamientos y consultas de cada paciente de manera organizada y segura.",
      img: "https://static.wixstatic.com/media/7869d1_8e6fd258fbd14449b44806f40dfca329~mv2.jpg/v1/fill/w_980,h_572,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7869d1_8e6fd258fbd14449b44806f40dfca329~mv2.jpg",
    },
  ];

  return (
    <section id="servicios" className="container mx-auto py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-12">Así te podemos ayudar</h2>
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-3">
        {servicios.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <button className="mt-4 px-4 py-2 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition text-sm">
                ¡Me interesa!
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
