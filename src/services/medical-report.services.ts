import { apilocal } from "./api";

export interface MedicalReport {
  id: string;
  patientId: string;
  organizationId: string;
  fecha: string; // ISO string
  informe: string;
}

export interface CreateMedicalReportDto {
  patientId: string;
  organizationId: string;
  fecha: string; // ISO string
  informe: string;
}

export interface UpdateMedicalReportDto {
  fecha?: string;
  informe?: string;
}

export interface Patient {
  id: string;
  name: string;
  aPaternal: string;
  aMaternal: string;
  ci: string;
  sexo: string;
  birthDate: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Organization {
  name: string;
  hostUser: string;
}

export const fetchMedicalReportsByOrg = async (organizationId: string) => {
  const response = await fetch(`${apilocal}/medical-reports?organizationId=${organizationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching medical reports");
  }
  return await response.json();
};

export const fetchMedicalReportById = async (id: string) => {
  const response = await fetch(`${apilocal}/medical-reports/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching medical report");
  }
  return await response.json();
};

export const fetchCreateMedicalReport = async (data: CreateMedicalReportDto) => {
  const response = await fetch(`${apilocal}/medical-reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error creating medical report");
  }
  return await response.json();
};

export const fetchUpdateMedicalReport = async (id: string, data: UpdateMedicalReportDto) => {
  const response = await fetch(`${apilocal}/medical-reports/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error updating medical report");
  }
  return await response.json();
};

export const fetchDeleteMedicalReport = async (id: string) => {
  const response = await fetch(`${apilocal}/medical-reports/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error deleting medical report");
  }
  return await response.json();
};

export const fetchDownloadMedicalReportPdf = async (id: string) => {
  const response = await fetch(`${apilocal}/medical-reports/${id}/pdf`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error downloading PDF");
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `informe-medico-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
