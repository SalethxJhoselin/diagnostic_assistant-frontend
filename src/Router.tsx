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
import NewConsultation from "./pages/clinic/NewConsultation";
import IAModel from "./pages/IAModel";
import ChatBot from "./pages/ChatBot";
import PatientsProfile from "./pages/clinic/PatientsProfile";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import CancerDePiel from "./pages/InfoDelHome/CancerPiel";
import DermatologiaGeneral from "./pages/InfoDelHome/DermatologiaGeneral";
import OrganizationSchedule from "./pages/appointments/OrganizationSchedule";

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
            <Route path="/cancer-de-piel" element={<CancerDePiel />} />
            <Route path="/dermatologia-general" element={<DermatologiaGeneral />} />

            {/* Rutas protegidas sin Layout */}
            <Route path="/dashboard/plans" element={
                <ProtectedRoute>
                    <Plans />
                </ProtectedRoute>
            } />
            <Route path="/dashboard/payment" element={
                <ProtectedRoute>
                    <Payment />
                </ProtectedRoute>
            } />

            {/* Rutas con Layout */}
            <Route element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard/organizations" element={<Organizations />} />
                <Route path="/dashboard/org/:id" element={<HomeOrganization />} />
                <Route path="/dashboard/org/:id/team" element={<TeamOrganization />} />

                <Route path="/dashboard/org/:id/clinic/patients" element={<Patients />} />
                <Route path="/dashboard/org/:id/clinic/patient/:patientId/history" element={<PatientsProfile />} />
                <Route path="/dashboard/org/:id/clinic/consultations" element={<Consultations />} />
                <Route path="/dashboard/org/:id/clinic/consultations/new" element={<NewConsultation />} />
                <Route path="/dashboard/org/:id/clinic/diagnoses" element={<Diagnoses />} />
                <Route path="/dashboard/org/:id/clinic/treatments" element={<Treatments />} />

                <Route path="/dashboard/org/:id/appointments" element={<MedicalAppointments />} />
                <Route path="/dashboard/org/:id/attention-hours" element={<Schedules />} />
                <Route path="/dashboard/org/:id/organization-schedules" element={<OrganizationSchedule />} />

                <Route path="/dashboard/org/:id/ia-model" element={<IAModel />} />
                <Route path="/dashboard/org/:id/chat-bot" element={<ChatBot />} />
                <Route path="/dashboard/org/:id/ia-model" element={<ModelIA />} />
                <Route path="/dashboard/org/:id/admin" element={<Admin />} />
            </Route>

            {/* Ruta comodín para manejar rutas no encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}