import { motion } from "framer-motion";

export default function AppMovil() {
  const buttonAnimation = {
    rotate: [-8, 8, -8],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  };

  return (
    <section className="bg-primary/20 py-28 px-12 rounded-lg shadow-lg w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-16 max-w-screen-xl mx-auto">
        {/* Imagen a la izquierda */}
        <img
          src="https://play-lh.googleusercontent.com/rUKScxVJpJaw_nJrpU-BXKNos1h41fWM67kk7-f2LSOQ4QbEGI4FOcxnd9os1yJJG7U=w526-h296-rw"
          alt="Banner App Diagnostic Assistant"
          className="w-full max-w-md rounded-2xl shadow-2xl border border-indigo-200"
        />

        {/* Texto y botón alineados a la derecha */}
        <div className="flex-1 max-w-xl text-right">
          <h2 className="text-4xl font-extrabold mb-4 text-primary leading-tight">
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
