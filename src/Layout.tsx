import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toaster } from "sonner";

export default function Layout() {
    return (
        <div className="flex flex-col w-full h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                    <Toaster/>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
