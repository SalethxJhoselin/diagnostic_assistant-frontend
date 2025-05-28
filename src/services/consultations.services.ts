import { apilocal } from "./api";
import type { GetDiagnoses } from "./diagnoses.services";
import type { GetTreatments } from "./treatments.services";

export interface Patient {
  id: string;
  name: string;
  aPaternal: string;
  aMaternal: string;
  ci: number;
  sexo: string;
  birthDate: Date;
}

export interface User {
  id: string;
  email: string;
}

export interface CreateConsultation {
  motivo: string;
  observaciones: string;
  organizationId: string;
  patientId: string;
  userId: string;
}

export interface AddConsulDiag {
    consultationId: string
    diagnosisId: string
}


export interface AddConsulTreat {
    consultationId: string
    treatmentId: string
}

export interface GetConsultation {
  id: string;
  motivo: string;
  observaciones: string;
  consultationDate: Date;
  treatments: GetTreatments[];
  diagnoses: GetDiagnoses[];
  patient: Patient;
  user: User;
}

export const fetchCreateConsultation = async (data: CreateConsultation) => {
    const response = await fetch(`${apilocal}/consultations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error creating consultations");
    }

    return await response.json();
}

export const fetchAddConsulDiag = async (data: AddConsulDiag) => {
    const response = await fetch(`${apilocal}/consultations/diagnosis`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error adding consultations/diagnosis");
    }

    return await response.json();
}

export const fetchAddConsulTreat = async (data: AddConsulTreat) => {
    const response = await fetch(`${apilocal}/consultations/treatment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error adding consultations/treatment");
    }

    return await response.json();
}

export const fetchConsulByOrg = async (organizationId:string) => {
  const response = await fetch(`${apilocal}/consultations/organization/${organizationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching consultations");
  }

  return await response.json();
};


export const fetchDeleteConsultation = async (id: string) => {
    const response = await fetch(`${apilocal}/consultations/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        throw new Error("Error deleting consultations");
    }

    return await response.json();
}

export const fetchUpdateConsultation = async (data:GetConsultation) => {
    const response = await fetch(`${apilocal}/consultations/${data.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error updating consultations");
    }

    return await response.json();
}