import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Organizations from "./pages/Organization";
import ModelIA from "./pages/Model";
import HomeOrganization from "./pages/HomeOrganization";
import TeamOrganization from "./pages/TeamOrganization";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Patients from "./pages/clinic/Patients";
import Consultations from "./pages/clinic/Consultations";
import Diagnostics from "./pages/clinic/Diagnostics";
import Treatments from "./pages/clinic/Treatments";
import MedicalAppointments from "./pages/appointments/MedicalAppointments";
import Schedules from "./pages/appointments/Schedules";
import { useAuth } from "@clerk/clerk-react";
import { useOrganization } from "./hooks/organizationContex";

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Página no encontrada</h2>
                <p className="text-gray-600 dark:text-gray-400">Lo sentimos, la página que buscas no existe.</p>
                <button 
                    onClick={() => window.history.back()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return <div>Cargando...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            
            <Route element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard/organizations" element={<Organizations />} />

                <Route path="/dashboard/org/:id" element={<HomeOrganization />} />
                <Route path="/dashboard/org/:id/team" element={<TeamOrganization />} />

                <Route path="/dashboard/org/:id/clinic/patients" element={<Patients />} />
                <Route path="/dashboard/org/:id/clinic/consultations" element={<Consultations />} />
                <Route path="/dashboard/org/:id/clinic/diagnoses" element={<Diagnostics />} />
                <Route path="/dashboard/org/:id/clinic/treatments" element={<Treatments />} />

                <Route path="/dashboard/org/:id/appointments" element={<MedicalAppointments />} />
                <Route path="/dashboard/org/:id/attention-hours" element={<Schedules />} />

                <Route path="/dashboard/org/:id/ia-model" element={<ModelIA />} />
                <Route path="/dashboard/org/:id/admin" element={<Admin />} />
            </Route>

            {/* Ruta comodín para manejar rutas no encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}