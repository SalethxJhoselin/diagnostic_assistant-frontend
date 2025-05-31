import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toaster } from "sonner";
import { IconChatBot } from "./assets/icons";
import { useState } from "react";
import AssistanceModal from "./components/AssitanceModal";

export default function Layout() {
    const location = useLocation()
    const [open, setOpen] = useState(false)
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
                    {!hideSidebar &&
                        <div className="fixed bottom-10 right-10 bg-primary p-2 
                        text-white rounded-full hover:bg-purple-500 transition-colors
                          hover:scale-110 cursor-pointer"
                            onClick={() => setOpen(true)}
                        >
                            <IconChatBot />
                        </div>
                    }
                    {open &&
                        <AssistanceModal onClose={() => setOpen(false)} />
                    }
                </main>
            </div>
        </div>
    );
}
