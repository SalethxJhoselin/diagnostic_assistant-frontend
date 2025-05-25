import { SignInButton, useAuth } from "@clerk/clerk-react";
import { IconLogo } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/NavBarHome";
import Footer from "@/components/FooterHome";

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

      {/* Sección principal / Hero */}
      <div className="container mx-auto px-4 py-16 text-center">
        <main className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <IconLogo />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Diagnostic Assistant
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tu asistente inteligente para diagnósticos médicos. Gestiona pacientes,
              consultas y tratamientos de manera eficiente.
            </p>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            {isSignedIn ? (
              <div
                onClick={handleStart}
                className="w-48 h-9 bg-primary text-white rounded-md
                flex items-center justify-center border cursor-pointer
                hover:bg-primary/95 transition-all"
              >
                <p>Start your organization</p>
              </div>
            ) : (
              <SignInButton mode="modal">
                <div
                  className="w-48 h-9 bg-primary text-white rounded-md
                  flex items-center justify-center border cursor-pointer
                  hover:bg-primary/95 transition-all"
                >
                  <p>Start your organization</p>
                </div>
              </SignInButton>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Accede a todas las funcionalidades de la plataforma
            </p>
          </div>
        </main>
      </div>

      {/* Servicios principales */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl border bg-secondary text-secondary-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Gestión de Pacientes</h3>
            <p>Administra historiales médicos y datos de pacientes de forma segura.</p>
          </div>
          <div className="p-6 rounded-xl border bg-secondary text-secondary-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Diagnósticos IA</h3>
            <p>Asistencia inteligente para diagnósticos más precisos.</p>
          </div>
          <div className="p-6 rounded-xl border bg-secondary text-secondary-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Citas Médicas</h3>
            <p>Sistema completo de gestión de citas y horarios.</p>
          </div>
        </div>
      </section>

      {/* Texto motivacional */}
      <section className="bg-muted text-center py-16 px-4">
        <h2 className="text-3xl font-semibold mb-4">Tu piel, un órgano con necesidades cambiantes</h2>
        <p className="max-w-3xl mx-auto text-muted-foreground">
          En <strong>Diagnostic Assistant</strong>, entendemos que cada etapa de la vida requiere
          atención especializada. Por eso, nuestro objetivo es ofrecerte herramientas modernas para
          cuidar tu salud dermatológica, sin complicaciones.
        </p>
        <div className="mt-6 text-muted-foreground">
          <p className="italic border-l-4 border-primary pl-4 max-w-xl mx-auto">
            “Siempre encontramos el equilibrio entre lo médico y lo estético.”
          </p>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition">
            Así te podemos ayudar
          </button>
        </div>
      </section>

      {/* Servicios detallados */}
      <section className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Así te podemos ayudar</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Cáncer De Piel",
              desc: "Evaluación y tratamiento de lunares y lesiones sospechosas.",
            },
            {
              title: "Diagnóstico y Tratamiento",
              desc: "Atención personalizada basada en IA para diferentes afecciones.",
            },
            {
              title: "Láser Estético y Médico",
              desc: "Tecnología avanzada para cicatrices, tatuajes y rejuvenecimiento.",
            },
            {
              title: "Fototerapia",
              desc: "Tratamiento seguro con rayos UV para psoriasis, vitiligo y más.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-card shadow-md">
              <div className="h-32 w-32 bg-primary/10 mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <button className="mt-3 px-4 py-1 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition text-sm">
                ¡Me interesa!
              </button>
            </div>
          ))}
        </div>
      </section>

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
