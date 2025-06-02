import { apilocal } from "./api";

// Interfaz para un miembro de la organización
export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
}

// Crear un miembro en la organización
export interface CreateOrganizationMember {
  organizationId: string;
  userId: string;
  role: string;
}

// Actualizar un miembro de la organización
export interface UpdateOrganizationMember {
  role: string;
}

// Obtener todos los miembros de la organización
export const fetchOrganizationMembers = async () => {
  const response = await fetch(`${apilocal}/organizations-members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

// Obtener todos los miembros de una organización específica
export const fetchMembersByOrganization = async (organizationId: string) => {
  const response = await fetch(`${apilocal}/organizations-members/organization/${organizationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

// Obtener todos los miembros de un usuario específico
export const fetchMembersByUser = async (userId: string) => {
  const response = await fetch(`${apilocal}/organizations-members/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

// Obtener un miembro específico
export const fetchMemberById = async (id: string) => {
  const response = await fetch(`${apilocal}/organizations-members/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

// Crear un miembro en la organización
export const fetchCreateMember = async (createOrganizationMember: CreateOrganizationMember) => {
  const response = await fetch(`${apilocal}/organizations-members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createOrganizationMember),
  });

  const result = await response.json();
  return result;
};

// Actualizar la información de un miembro de la organización
export const fetchUpdateMember = async (
  id: string,
  updateOrganizationMember: UpdateOrganizationMember
) => {
  const response = await fetch(`${apilocal}/organizations-members/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateOrganizationMember),
  });

  const result = await response.json();
  return result;
};

// Eliminar un miembro de la organización
export const fetchRemoveMember = async (id: string) => {
  const response = await fetch(`${apilocal}/organizations-members/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};
