export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-10 mt-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Planes de suscripción</h4>
          <p>Información sobre planes de suscripción</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Banners publicitarios</h4>
          <p>Oportunidades de promoción para tu clínica o servicio</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Visibilidad online</h4>
          <p>Cómo atraer más pacientes a consulta médica</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Acerca de</h4>
          <ul className="space-y-1">
            <li><a  className="hover:underline">Contacto</a></li>
            <li><a className="hover:underline">Política de datos</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Acceso de usuarios</h4>
          <ul className="space-y-1">
            <li><a  className="hover:underline">Iniciar sesión</a></li>
            <li><a  className="hover:underline">Restablecer contraseña</a></li>
            <li><a  className="hover:underline">Cerrar sesión</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-4">
        © 2025 Diagnostic Assistant. Un proyecto académico desarrollado por estudiantes.
      </div>
    </footer>
  );
}
