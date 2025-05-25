import { IconLogo } from "@/assets/icons";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm border-b border-blue-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <IconLogo />
                    <span className="text-xl font-semibold text-blue-700">Diagnostic Assistant</span>
                </div>
                <div className="hidden md:flex space-x-6">
                    <a href="#inicio" className="text-blue-700 hover:text-blue-900 font-medium">Inicio</a>
                    <a href="#servicios" className="text-blue-700 hover:text-blue-900 font-medium">Servicios</a>
                    <a href="#sobre" className="text-blue-700 hover:text-blue-900 font-medium">Sobre Nosotros</a>
                    <a href="#contacto" className="text-blue-700 hover:text-blue-900 font-medium">Contacto</a>
                </div>
            </div>
        </nav>
    );
}
