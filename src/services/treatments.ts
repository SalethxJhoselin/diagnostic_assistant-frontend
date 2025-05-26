import { apilocal } from "./api";

export interface CreateTreatment {
    description: string;
    duration: string;
    instructions: string;
    organizationId: string;
}

export interface GetTreatments{
    id: string;
    description: string;
    duration: string;
    instructions: string;
    organizationId: string; 
}

export const fetchCreateTreatment = async (data: CreateTreatment) => {
    const response = await fetch(`${apilocal}/treatments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error creating treatment");
    }

    return await response.json();
}

export const fetchTreatmentsByOrg = async (organizationId: string) => {
    const response = await fetch(`${apilocal}/treatments/organization/${organizationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Error fetching treatments");
    }

    return await response.json();
}

export const fetchDeleteTreatments = async (id: string) => {
    const response = await fetch(`${apilocal}/treatments/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        throw new Error("Error deleting treatments");
    }

    return await response.json();
}