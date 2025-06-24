import { SignInButton, useAuth } from "@clerk/clerk-react";
import { IconLogo } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/home/NavBarHome";
import Footer from "@/components/home/FooterHome";
import ServiciosDestacados from "@/components/home/Servicios";
import TextoMotivacional from "@/components/home/textoMotivacional";
import ServiciosPrincipales from "@/components/home/serviciosEspeciales";
import AboutUs from "@/components/home/aboutUs";
import { cubicBezier, motion } from "framer-motion";
import AppMovil from "@/components/home/InfoAppMovil";

export default function Home() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/dashboard/organizations");
  };
  const buttonAnimation = {
    rotate: [-8, 8, -8],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: cubicBezier(0.42, 0, 0.58, 1) ,
    },
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar con padding superior reservado */}
      <div className="pt-6">
        <Navbar />
      </div>

      {/* Sección principal / Hero con imagen de fondo pastel */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage:
            "url('https://images.saymedia-content.com/.image/t_share/MTkyOTkyMzE2OTQ3MjQ0MjUz/website-background-templates.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Sombra sutil opcional para legibilidad */}
        <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-sm"></div>

        {/* Contenido animado con framer-motion */}
        <motion.div
          className="relative z-10 px-6 max-w-4xl space-y-6"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mx-auto w-16 h-16">
            <IconLogo />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Diagnostic Assistant
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-200">
            Tu asistente inteligente para diagnósticos médicos. Gestiona pacientes,
            consultas y tratamientos de manera eficiente y con ayuda de la Inteligencia Artificial.
          </p>

          {isSignedIn ? (
            <motion.div
              onClick={handleStart}
              className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition cursor-pointer"
              animate={buttonAnimation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            >
              Start your organization
            </motion.div>
          ) : (
            <SignInButton forceRedirectUrl={'/dashboard/organizations'} mode="modal">
              <div className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition cursor-pointer">
                Start your organization
              </div>
            </SignInButton>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Accede a todas las funcionalidades de la plataforma, Conoce los planes disponibles.
          </p>
        </motion.div>
      </section>

      <ServiciosPrincipales />
      <TextoMotivacional />
      <ServiciosDestacados />
      <AboutUs/>
      <AppMovil/>
      <Footer />
    </div>
  );
}
