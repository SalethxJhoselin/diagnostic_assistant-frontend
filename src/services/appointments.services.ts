import { apilocal } from "./api";

export interface Appointment {
  id: string;
  date: string;
  startTime: Date;
  endTime: Date;    
  patient: {
    id?: string;
    name: string;
    aPaternal?: string;
    aMaternal?: string;
  };
  organizationId: string;
  estado: string;
}

export interface CreateAppointmentDto {
  date: string;
  startTime: Date;
  endTime: Date;
  patientId: string;
  organizationId: string;
}

export interface UpdateAppointmentDto {
  date: string;
  startTime: Date;
  endTime: Date;
  patientId: string;
  organizationId: string;
}


const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error en la operación");
  }
  return res.json();
};


export const fetchCreateAppointment = async (data: CreateAppointmentDto) => {
  const res = await fetch(`${apilocal}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const fetchAppointmentsByOrg = async (organizationId: string) => {
  const res = await fetch(`${apilocal}/appointments?organizationId=${organizationId}`);
  return handleResponse(res);
};

export const fetchAppointmentById = async (id: string) => {
  const res = await fetch(`${apilocal}/appointments/${id}`);
  return handleResponse(res);
};

export const fetchUpdateAppointment = async (id: string, data: UpdateAppointmentDto) => {
  const res = await fetch(`${apilocal}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const fetchDeleteAppointment = async (id: string) => {
  const res = await fetch(`${apilocal}/appointments/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
};
