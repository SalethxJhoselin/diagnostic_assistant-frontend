import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ModelIA from "./pages/model";
import Organizations from "./pages/Organization";

export function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/dashboard/model" element = {<ModelIA/>} />
                <Route path="/dashboard/organizations" element = {<Organizations/>} />
            </Route>
        </Routes>
    )
}