import type { Organization } from "@/lib/interfaces";
import type { User } from "@/services/usuarioServices";
import { createContext, useContext, useEffect, useState } from "react";

type OrganizationContextType = {
  user: User | undefined
  organization: Organization | undefined;
  openMenu: boolean
  setOrganization: React.Dispatch<React.SetStateAction<Organization | undefined>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
  handleSetOrganization: (org: Organization) => void;
};

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | undefined>(undefined);
  const [openMenu, setOpenMenu] = useState(false)
  const [user,setUser] = useState<User | undefined>(undefined)


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
      setOpenMenu,user,setUser
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
