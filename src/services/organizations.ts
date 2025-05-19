import { apilocal } from "./api";

export const fetchOrganizationsByUser = async (email: string, isActive:boolean) => {
  const response = await fetch(`${apilocal}/organizations/user/${email}?isActive=${isActive}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result
};
