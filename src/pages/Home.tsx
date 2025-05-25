import { SignInButton, useAuth } from "@clerk/clerk-react";
import { IconLogo } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/NavBarHome";

export default function Home() {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/dashboard/organizations");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
             <Navbar />
            <div className="container mx-auto px-4 py-8">
                <main className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
                    <div className="space-y-4">
                        <IconLogo />
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Diagnostic Assistant
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Tu asistente inteligente para diagnósticos médicos. Gestiona pacientes,
                            consultas y tratamientos de manera eficiente.
                        </p>
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        {isSignedIn ? (
                            <div
                                onClick={handleStart}
                                className="w-48 h-9 bg-blue-600 text-white rounded-md
                                    flex items-center justify-center border cursor-pointer
                                    hover:bg-blue-700 transition-all"
                            >
                                <p>Start your organization</p>
                            </div>
                        ) : (
                            <SignInButton mode="modal">
                                <div className="w-48 h-9 bg-blue-600 text-white rounded-md
                                    flex items-center justify-center border cursor-pointer
                                    hover:bg-blue-700 transition-all">
                                    <p>Start your organization</p>
                                </div>
                            </SignInButton>
                        )}

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Accede a todas las funcionalidades de la plataforma
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12" id="servicios">
                        <div className="p-6 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/50">
                            <h3 className="text-xl font-semibold mb-2">Gestión de Pacientes</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Administra historiales médicos y datos de pacientes de forma segura
                            </p>
                        </div>
                        <div className="p-6 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/50">
                            <h3 className="text-xl font-semibold mb-2">Diagnósticos IA</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Asistencia inteligente para diagnósticos más precisos
                            </p>
                        </div>
                        <div className="p-6 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/50">
                            <h3 className="text-xl font-semibold mb-2">Citas Médicas</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sistema completo de gestión de citas y horarios
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
