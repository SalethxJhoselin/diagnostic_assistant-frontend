import { useEffect, useState } from "react";
import { IconLogo } from "@/assets/icons";
import { ToggleThemeButton } from "./ToggleThemeButton";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export default function Navbar() {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scroll hacia abajo
                setShow(false);
            } else {
                // Scroll hacia arriba o al inicio
                setShow(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={`shadow-sm fixed w-full top-0 z-50 bg-background transition-transform duration-300 ${
                show ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <IconLogo />
                    <span className="text-xl font-semibold text-blue-700">Diagnostic Assistant</span>
                </div>
                <div className="hidden md:flex space-x-6">
                    <a href="#inicio" className="text-blue-700 hover:text-blue-900 font-medium">Cancer de Piel</a>
                    <a href="#inicio" className="text-blue-700 hover:text-blue-900 font-medium">Dermatología General</a>
                    <a href="#servicios" className="text-blue-700 hover:text-blue-900 font-medium">Servicios</a>
                    <a href="#sobre" className="text-blue-700 hover:text-blue-900 font-medium">Sobre Nosotros</a>
                    <a href="#contacto" className="text-blue-700 hover:text-blue-900 font-medium">Contacto</a>
                </div>
                <section className="flex items-center gap-4">
                    <ToggleThemeButton />
                    <SignedOut>
                        <Button>
                            <SignInButton />
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-14 h-14",
                                },
                            }}
                        />
                        <SyncUserWithBackend />
                    </SignedIn>
                </section>
            </div>
        </nav>
    );
}
