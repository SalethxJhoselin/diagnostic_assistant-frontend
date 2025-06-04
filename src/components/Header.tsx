import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { IconLogo, IconMenu, IconChevronLeft } from "@/assets/icons";
import { useOrganization } from "@/hooks/organizationContex";
import { Link, useLocation } from "react-router-dom";
import { OrganizationSelector } from "./OrganizationSelector";

export default function Header() {
    const { organization, setOpenMenu, openMenu } = useOrganization()

    const location = useLocation()
    const hideOrganization = location.pathname.startsWith("/dashboard/organizations");

    return (
        <header className="w-full lg:h-14 h-11 flex items-center justify-between px-2 border-b
            sticky z-10 top-0 backdrop-blur-lg">
            <section className="flex gap-x-3 items-center">
                <Link to={'/'}>
                    <IconLogo />
                </Link>
                {!hideOrganization && (
                    <Link to="/dashboard/organizations" className="flex items-center gap-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <IconChevronLeft />
                        <span>Organizaciones</span>
                    </Link>
                )}
                <div className="flex items-center gap-x-1">
                    <span className="">/</span>
                    {hideOrganization ?
                        <h1 className="font-semibold text-sm animate-fade-in-left">Organizations</h1>
                        :
                        <div className="flex items-center justify-center sm:gap-2 ">
                            <h1 className="font-semibold text-sm animate-fade-in-left">{organization?.name}</h1>
                            <div className="max-sm:hidden font-semibold text-[12px] border-zinc-500
                                border rounded-2xl px-2.5 py-1 pb-1cursor-pointer">
                                {organization?.subscriptions[0].plan.name || ''}
                            </div>
                            <OrganizationSelector />
                        </div>
                    }
                </div>
            </section>
            <section className="flex items-center sm:gap-1">
                <ToggleThemeButton />
                <SignedOut>
                    <Button>
                        <SignInButton />
                    </Button>
                </SignedOut>

                <div className="max-sm:hidden">
                    <SignedIn>
                        <UserButton />
                        <SyncUserWithBackend />
                    </SignedIn>
                </div>
                <button className="bg-secondary p-1 rounded-lg hover:rotate-3 transition-all
                    sm:hidden"
                    onClick={() => setOpenMenu(!openMenu)}>
                    <IconMenu />
                </button>
            </section>
        </header>
    );
}
