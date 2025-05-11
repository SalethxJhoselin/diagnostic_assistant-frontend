import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import App from "./App";

export function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element = {<App/>} />
            </Route>
        </Routes>
    )
}