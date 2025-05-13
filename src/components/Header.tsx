import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Header() {
    return (
        <header className="bg-zinc-600 w-full h-12 flex items-center justify-between
        text-white px-2">
            <h1>Header</h1>
            <section>
                <SignedOut>
                    <div className="bg-primary p-1 px-4 font-semibold rounded-xl">
                        <SignInButton />
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </section>
        </header>
    )
}