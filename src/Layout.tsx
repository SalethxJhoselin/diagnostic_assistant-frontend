import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toaster } from "sonner";

export default function Layout() {
    const location = useLocation()
    const hideSidebar = location.pathname.startsWith("/dashboard/organizations");

    return (
        <div className="flex flex-col w-full min-h-dvh">
            <Header />
            <div className="flex flex-1">
                {
                    !hideSidebar &&
                    <Sidebar />
                }
                <main className="flex-1 overflow-auto">
                    <Toaster />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
