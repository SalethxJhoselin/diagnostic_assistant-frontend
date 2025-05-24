import type { Organization } from "@/lib/interfaces";
import { createContext, useContext, useEffect, useState } from "react";

type OrganizationContextType = {
    organization: Organization | undefined;
    setOrganization: React.Dispatch<React.SetStateAction<Organization | undefined>>;
    handleSetOrganization: (org:Organization) => void;
};

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | undefined>(undefined);

    useEffect(() => {
    const stored = localStorage.getItem("selectedOrganization");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Organization;
        setOrganization(parsed);
      } catch (e) {
        console.error("Error parsing stored organization", e);
      }
    }
  }, []);

  const handleSetOrganization = (org: Organization) => {
    setOrganization(org);
    localStorage.setItem("selectedOrganization", JSON.stringify(org));
  };

    return (
        <OrganizationContext.Provider value={{ organization, setOrganization,handleSetOrganization }}>
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
