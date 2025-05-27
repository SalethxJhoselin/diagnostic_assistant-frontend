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
import Treatments from "./pages/clinic/Treatments";
import MedicalAppointments from "./pages/appointments/MedicalAppointments";
import Schedules from "./pages/appointments/Schedules";
import { useAuth } from "@clerk/clerk-react";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import Diagnoses from "./pages/clinic/Diagnoses";


function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setShowContent(true)
            }, 1000);
            return () => clearTimeout(timer)
        }
    }, [isLoaded])

    if (!isLoaded || !showContent) {
        return (
            <Loader/>
        )
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
                <Route path="/dashboard/org/:id/clinic/diagnoses" element={<Diagnoses />} />
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