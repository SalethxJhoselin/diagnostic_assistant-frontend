import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";

export default function Header() {
    return (
        <header className="w-full h-14 flex items-center justify-between px-2 border-b">
            <h1>Header</h1>
            <section>
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
    )
}