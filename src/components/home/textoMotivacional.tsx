export default function TextoMotivacional() {
  return (
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
  );
}
