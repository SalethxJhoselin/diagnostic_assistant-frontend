import { apilocal } from "./api";

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Función para obtener un usuario por su email
export const fetchUserByEmail = async (email: string) => {
  const response = await fetch(`${apilocal}/users/email/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Usuario no encontrado");
  }

  const result = await response.json();
  return result;
};
