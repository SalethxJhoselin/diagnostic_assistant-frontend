import { Route, Routes } from "react-router-dom";
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

export function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
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
        </Routes>
    )
}