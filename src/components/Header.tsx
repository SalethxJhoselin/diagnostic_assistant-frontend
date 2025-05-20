import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { IconLogo } from "@/assets/icons";
import { useOrganization } from "@/hooks/organizationContex";
import { useLocation } from "react-router-dom";
import { OrganizationSelector } from "./OrganizationSelector";

export default function Header() {
    const { organization } = useOrganization()
    const location = useLocation()
    const hideOrganization = location.pathname.startsWith("/dashboard/organizations");

    return (
        <header className="w-full lg:h-14 h-11 flex items-center justify-between px-2 border-b">
            <section className="flex gap-x-3 items-center">
                <IconLogo />
                <div className="flex items-center gap-x-1">
                    <span className="">/</span>
                    {hideOrganization ?
                        <h1 className="font-semibold text-sm animate-fade-in-left">Organizations</h1>
                        :
                        <div className="flex items-center justify-center gap-2 relative">
                            <h1 className="font-semibold text-sm animate-fade-in-left">{organization?.name}</h1>
                            <div className=" font-semibold text-[12px] border-zinc-400
                                border rounded-2xl px-2.5 pb-1 absolute top-0 -right-14 cursor-pointer">
                                {organization?.subscriptions[0].plan.name}
                            </div>
                            <div className="absolute -right-22">
                                <OrganizationSelector />
                            </div>
                        </div>

                    }
                </div>
            </section>
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
        </header>
    );
}
