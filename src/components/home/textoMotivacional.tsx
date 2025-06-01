export default function TextoMotivacional() {
  return (
    <section
      className="relative py-20 px-4 text-center"
      style={{
        backgroundImage:
          "url('https://cdn.vectorstock.com/i/preview-1x/52/82/holographic-gradient-background-vector-55315282.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Desvanecimiento para contraste */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-black dark:text-white">
        <h2 className="text-3xl font-bold mb-4">
          Tu piel, un órgano con necesidades cambiantes
        </h2>
        <p className="text-muted-foreground dark:text-gray-300">
          En <strong>Diagnostic Assistant</strong>, entendemos que cada etapa de la vida requiere
          atención especializada. Por eso, nuestro objetivo es ofrecerte herramientas modernas para
          cuidar tu salud dermatológica, sin complicaciones.
        </p>
        <div className="mt-6 text-muted-foreground">
          <p className="italic border-l-4 border-primary pl-4 max-w-xl mx-auto text-sm">
            “Siempre encontramos el equilibrio entre lo médico y lo estético.”
          </p>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition">
            Así te podemos ayudar
          </button>
        </div>
      </div>
    </section>
  );
}
