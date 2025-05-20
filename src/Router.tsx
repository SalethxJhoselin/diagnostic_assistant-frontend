import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Organizations from "./pages/Organization";
import ModelIA from "./pages/Model";
import HomeOrganization from "./pages/HomeOrganization";
import TeamOrganization from "./pages/TeamOrganization";
import Admin from "./pages/Admin";

export function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/dashboard/model" element = {<ModelIA/>} />
                <Route path="/dashboard/organizations" element = {<Organizations/>} />
                <Route path="/dashboard/org/:id" element = {<HomeOrganization/>} />
                <Route path="/dashboard/org/:id/team" element = {<TeamOrganization/>} />
                <Route path="/dashboard/org/:id/admin" element = {<Admin/>} />
            </Route>
        </Routes>
    )
}