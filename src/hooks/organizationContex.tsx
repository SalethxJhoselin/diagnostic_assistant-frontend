import type { Organization } from "@/lib/interfaces";
import { createContext, useContext, useEffect, useState } from "react";

type OrganizationContextType = {
  organization: Organization | undefined;
  openMenu: boolean
  setOrganization: React.Dispatch<React.SetStateAction<Organization | undefined>>;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
  handleSetOrganization: (org: Organization) => void;
};

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | undefined>(undefined);
  const [openMenu, setOpenMenu] = useState(false)


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
    <OrganizationContext.Provider value={{ organization, setOrganization, handleSetOrganization,openMenu,
      setOpenMenu
     }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = (): OrganizationContextType => {
  const contex = useContext(OrganizationContext)
  if (!contex)
    throw new Error('')
  return contex
}
