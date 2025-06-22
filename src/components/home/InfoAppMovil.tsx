import { motion } from "framer-motion";

export default function AppMovil() {
  const buttonAnimation = {
    rotate: [-10, 10, -10],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: [0.25, 0.1, 0.25, 1],
    },
  };

  return (
    <section id="contacto" className="bg-primary/20 py-28 px-12 rounded-lg shadow-lg w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-16 max-w-screen-xl mx-auto">
        {/* Imagen a la izquierda */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/joalcamo-4a398.appspot.com/o/photo_5053096158834044556_y.jpg?alt=media&token=5ad292db-14bd-462b-b249-36d14c29421d"
          alt="Banner App Diagnostic Assistant"
          className="w-full max-w-md rounded-2xl shadow-2xl border border-indigo-200"
        />

        {/* Texto y botón alineados a la derecha */}
        <div className="flex-1 max-w-xl text-right">
          <h1 className="text-5xl font-extrabold mb-4 text-primary leading-tight">
            Descarga la App Movil
          </h1>
          <h2 className="text-4xl font-exstrabold mb-4 text-primary leading-tight">
            Lleva <span className="text-indigo-600">Diagnostic Assistant</span> en tu bolsillo
          </h2>
          <p className="text-indigo-700 mb-12 text-xl font-medium leading-relaxed">
            Gestiona tus consultas, recibe recordatorios y accede a tus diagnósticos médicos dondequiera que estés. Fácil, rápida y segura.
          </p>
          <motion.a
            href="https://play.google.com/store/apps/details?id=com.aidermatologist&hl=es-MX&pli=1"
            className="inline-block bg-indigo-600 text-white px-10 py-5 rounded-full hover:bg-indigo-700 shadow-lg transition text-2xl font-bold cursor-pointer select-none"
            animate={buttonAnimation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ¡Descarga Ya!
          </motion.a>
          
        </div>
      </div>
    </section>
  );
}
