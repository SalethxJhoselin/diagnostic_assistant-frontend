import { useEffect, useState } from "react";
import { IconLogo } from "@/assets/icons";
import { ToggleThemeButton } from "../ToggleThemeButton";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function NavbarAux() {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShow(false); // Scroll hacia abajo
            } else {
                setShow(true); // Scroll hacia arriba
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={`fixed w-full top-0 z-50 bg-background shadow-sm transition-transform duration-300 ${
                show ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo + título */}
                <div className="flex items-center space-x-2">
                   <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
                        <IconLogo />
                        <span className="text-xl font-semibold text-foreground">
                            Diagnostic Assistant
                        </span>
                    </Link>
                </div>

                {/* Botones de sesión y tema */}
                <section className="flex items-center gap-4">
                    <ToggleThemeButton />
                    <SignedOut>
                        <Button>
                            <SignInButton forceRedirectUrl={'/dashboard/organizations'} mode="redirect" />
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
