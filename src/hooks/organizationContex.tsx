import type { Organization } from "@/lib/interfaces";
import { fetchOrganizationsByUser } from "@/services/organizations";
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export const OrganizationContext = createContext<Organization[] | undefined>(undefined);

export const useOrganizations = () => useContext(OrganizationContext);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const [organizations, setOrganizations] = useState<Organization[] | undefined>(undefined);
    const { user } = useUser();

    useEffect(() => {
        const fetchOrgs = async () => {
            if (user) {
                const orgs = await fetchOrganizationsByUser(user.primaryEmailAddress?.emailAddress || '', true);
                setOrganizations(orgs);
            }
        };
        fetchOrgs();
    }, [user]);

    return (
        <OrganizationContext.Provider value={organizations}>
            {children}
        </OrganizationContext.Provider>
    );
}

