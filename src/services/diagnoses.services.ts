import { apilocal } from "./api"

export interface CreateDiagnoses{
    name: string
    description: string
    organizationId: string
}

export interface GetDiagnoses{
    id: string
    name: string
    description: string
    creationDate: Date
    organizationId: string
}

export interface UpdateDiagnoses{
    name: string
    description: string
    organizationId: string
}

export const fetchCreateDiagnoses = async (data: CreateDiagnoses) => {
    const response = await fetch(`${apilocal}/diagnoses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error creating diagnoses");
    }

    return await response.json();
}

export const fetchDiagnosesByOrg = async (organizationId: string) => {
    const response = await fetch(`${apilocal}/diagnoses/organization/${organizationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Error fetching diagnoses");
    }

    return await response.json();
}

export const fetchDeleteDiagnoses = async (id: string) => {
    const response = await fetch(`${apilocal}/diagnoses/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        throw new Error("Error deleting diagnoses");
    }

    return await response.json();
}

export const fetchUpdateDiagnoses = async (id:string,data:UpdateDiagnoses) => {
    const response = await fetch(`${apilocal}/diagnoses/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error updating diagnoses");
    }

    return await response.json();
}