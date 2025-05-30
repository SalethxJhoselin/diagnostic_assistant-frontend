import { apilocal } from "./api";

export interface CreatePatient {
  name: string;
  aPaternal: string;
  aMaternal: string;
  sexo: string;
  birthDate: string;
  phone: string;
  email: string;
  ci: number;
  organizationId: string;
}

export interface GetPatient {
  id: string;
  name: string;
  aPaternal: string;
  aMaternal: string;
  sexo: string;
  birthDate: Date;
  phone:number
  email:string
  ci: number;
  createAdt:Date
  organizationId:string
}

export const fetchPatientsByOrg = async (organizationId:string) => {
  const response = await fetch(`${apilocal}/patients?organizationId=${organizationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching patients");
  }

  return await response.json();
}
