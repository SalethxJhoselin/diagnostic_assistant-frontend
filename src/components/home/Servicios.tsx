
export default function ServiciosDestacados() {
  const servicios = [
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
  ];

  return (
    <section id="servicios" className="container mx-auto py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-8">Así te podemos ayudar</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {servicios.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border bg-card shadow-md transition hover:shadow-lg"
          >
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
  );
}
