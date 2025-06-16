import { apilocal } from "./api";

export interface AttentionHour {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
  organizationId: string;
  users: {
    id: string;
    email: string;
  }[];
}

export interface CreateAttentionHour {
  days: string[];
  startTime: string;
  endTime: string;
  organizationId: string;
}

export interface UpdateAttentionHour {
  days?: string[];
  startTime?: string;
  endTime?: string;
}

export interface AssignUserToHour {
  userId: string;
  attentionHourId: string;
}

export interface AssignMultipleUsersToHour {
  userIds: string[];
  attentionHourId: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la operación');
  }
  return response.json();
};

export const fetchCreateAttentionHour = async (data: CreateAttentionHour) => {
  const response = await fetch(`${apilocal}/attention-hour`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const fetchOrganizationAttentionHours = async (organizationId: string) => {
  const response = await fetch(`${apilocal}/attention-hour/organization/${organizationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const fetchAttentionHourById = async (id: string) => {
  const response = await fetch(`${apilocal}/attention-hour/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const fetchUpdateAttentionHour = async (id: string, data: UpdateAttentionHour) => {
  const response = await fetch(`${apilocal}/attention-hour/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const fetchDeleteAttentionHour = async (id: string) => {
  const response = await fetch(`${apilocal}/attention-hour/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const fetchAssignUserToHour = async (data: AssignUserToHour) => {
  const response = await fetch(`${apilocal}/attention-hour/attHourUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const fetchRemoveUserFromHour = async (data: AssignUserToHour) => {
  const response = await fetch(`${apilocal}/attention-hour/attHourUser`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const fetchUsersByAttentionHour = async (attentionHourId: string) => {
  const response = await fetch(`${apilocal}/attention-hour/users/${attentionHourId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const fetchAssignMultipleUsersToHour = async (data: AssignMultipleUsersToHour) => {
  const response = await fetch(`${apilocal}/attention-hour/attHourUsers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const fetchRemoveMultipleUsersFromHour = async (data: AssignMultipleUsersToHour) => {
  const response = await fetch(`${apilocal}/attention-hour/attHourUsers`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
