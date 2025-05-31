export default function ServiciosPrincipales() {
  return (
    <section className="container mx-auto px-4 py-12 text-centerfits">
     <h2 className="text-3xl font-bold mb-8 ">Servicios Principales de tu Organizacion</h2>

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
  );
}
