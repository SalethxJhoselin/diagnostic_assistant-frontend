import { SignInButton, useAuth } from "@clerk/clerk-react";
import { IconLogo } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/home/NavBarHome";
import Footer from "@/components/home/FooterHome";
import ServiciosDestacados from "@/components/home/Servicios";
import TextoMotivacional from "@/components/home/textoMotivacional";
import ServiciosPrincipales from "@/components/home/serviciosEspeciales";

export default function Home() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/dashboard/organizations");
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

        <div className="relative z-10 px-6 max-w-4xl space-y-6">
          <div className="mx-auto w-16 h-16">
            <IconLogo />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Diagnostic Assistant
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-200">
            Tu asistente inteligente para diagnósticos médicos. Gestiona pacientes,
            consultas y tratamientos de manera eficiente.
          </p>

          {isSignedIn ? (
            <div
              onClick={handleStart}
              className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition cursor-pointer"
            >
              Start your organization
            </div>
          ) : (
            <SignInButton forceRedirectUrl={'/dashboard/organizations'} mode="modal">
              <div className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition cursor-pointer">
                Start your organization
              </div>
            </SignInButton>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Accede a todas las funcionalidades de la plataforma
          </p>
        </div>
      </section>


      {/* Servicios principales */}
      <ServiciosPrincipales />

      {/* Texto motivacional */}
      <TextoMotivacional />
      <ServiciosDestacados />

      {/* Sobre nosotros */}
      <section id="sobre" className="bg-muted py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Sobre Nosotros</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
          Somos un equipo multidisciplinario comprometido con brindar soluciones dermatológicas mediante tecnología de vanguardia.
          Nuestro enfoque combina inteligencia artificial, experiencia clínica y diseño centrado en el paciente.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="w-36 h-36 bg-gray-300 rounded-full" />
          <div className="w-36 h-36 bg-gray-300 rounded-full" />
          <div className="w-36 h-36 bg-gray-300 rounded-full" />
        </div>
      </section>

      {/* Convenios */}
      <section className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Nuestros convenios</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Seguros Médicos",
              desc: "25% de descuento para pacientes con seguro en condiciones específicas.",
            },
            {
              title: "Pacientes Extranjeros",
              desc: "Descuentos en consulta y procedimientos presentando pasaporte.",
            },
            {
              title: "Pacientes SUS",
              desc: "50% de descuento en consulta y 25% en tratamientos médicos y estéticos.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border bg-secondary text-secondary-foreground p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <button className="mt-8 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition">
          Agenda tu cita presencial o virtual
        </button>
      </section>

      <Footer />
    </div>
  );
}
