import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";

export default function Header() {
    return (
        <header className="bg-zinc-600 w-full h-12 flex items-center justify-between
        text-white px-2">
            <h1>Header</h1>
            <section>
                <SignedOut>
                    <Button>
                        <SignInButton />
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                    <SyncUserWithBackend/>
                </SignedIn>
            </section>
        </header>
    )
}