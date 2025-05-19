import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";
import { useThemeToggle } from "@/hooks/useThemeToggle"; 

export default function Header() {
    const { isDark, toggleTheme } = useThemeToggle();

    return (
        <header className="w-full h-14 flex items-center justify-between px-2 border-b">
            <h1>Header</h1>
            <section className="flex items-center gap-4">
                {/* Botón para cambiar tema */}
                <button onClick={toggleTheme} className="p-2 rounded hover:bg-accent">
                    {isDark ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-sun">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                            <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-moon">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                        </svg>
                    )}
                </button>

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
        </header>
    );
}
