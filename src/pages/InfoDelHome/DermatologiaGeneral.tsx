import { useNavigate } from "react-router-dom";
import Footer from "@/components/home/FooterHome";
import { motion } from "framer-motion";
import NavbarAux from "@/components/home/NavBarAux";

export default function DermatologiaGeneral() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/dashboard/organizations");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarAux />

      <section className="pt-24 px-6 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Dermatología General</h1>
          <p className="text-lg text-muted-foreground">
            Atención integral para todo tipo de afecciones dermatológicas con asistencia tecnológica de vanguardia.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">¿Qué tratamos?</h2>
            <p>
              Nuestro asistente te ayuda en el diagnóstico y seguimiento de enfermedades comunes como acné, dermatitis, psoriasis, infecciones, entre otras.
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground">
              <li>Consulta asistida por IA</li>
              <li>Tratamientos personalizados</li>
              <li>Historial clínico integrado</li>
            </ul>
            <button
              onClick={handleStart}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
            >
              Agendar consulta
            </button>
          </motion.div>

          <motion.img
            src="https://th.bing.com/th/id/OIP._mPpouXLXkmNdeQhIaSOXAHaE8?rs=1&pid=ImgDetMain"
            alt="Dermatología General"
            className="rounded-xl shadow-md w-full h-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
