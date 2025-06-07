import { useNavigate } from "react-router-dom";
import Footer from "@/components/home/FooterHome";
import { motion } from "framer-motion";
import NavbarAux from "@/components/home/NavBarAux";

export default function CancerDePiel() {
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
          <h1 className="text-4xl font-bold mb-4">Cáncer de Piel</h1>
          <p className="text-lg text-muted-foreground">
            Detección temprana, evaluación y tratamiento con tecnología de inteligencia artificial y experiencia clínica.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 items-center">
          <motion.img
            src="https://th.bing.com/th/id/OIP.b3UacBHK8bgP-xvk5IIDaAHaEc?rs=1&pid=ImgDetMain"
            alt="Cáncer de Piel"
            className="rounded-xl shadow-md w-full h-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">¿Por qué es importante?</h2>
            <p>
              El cáncer de piel, cuando es detectado a tiempo, puede ser tratado con éxito. Nuestro sistema analiza imágenes dermatológicas para detectar patrones sospechosos.
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground">
              <li>Detección de lunares y lesiones atípicas</li>
              <li>Seguimiento de evolución</li>
              <li>Evaluación basada en IA</li>
            </ul>
            <button
              onClick={handleStart}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
            >
              Comenzar evaluación
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
