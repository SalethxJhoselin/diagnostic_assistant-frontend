import type { Organization } from "@/lib/interfaces";
import { createContext, useContext, useState } from "react";

type OrganizationContextType = {
    organization: Organization | undefined;
    setOrganization: React.Dispatch<React.SetStateAction<Organization | undefined>>;
};

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | undefined>(undefined);

    return (
        <OrganizationContext.Provider value={{ organization, setOrganization }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export const useOrganization = ():OrganizationContextType =>{
    const contex = useContext(OrganizationContext)
    if(!contex)
        throw new Error('')
    return contex
}
