import { apilocal } from "./api";

export interface Plan{
  id:string
  name:string
  description: string
  limitMembers: number
  limitModelUses:number
  price:number
  durationInDays:number
}

export interface CreateOrg{
  name:string
  hostUser:string
}

export interface CreateSubs{
  organizationId: string
  planId:string
}

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

export const fetchOrganizationsMembershipsByUser = async (userId: string) => {
  const response = await fetch(`${apilocal}/organizations-members/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

export const fetchOrganizationsMembershipsByUserEmail = async (email: string) => {
  const response = await fetch(`${apilocal}/organizations-members/user/email/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

export const fetchOrgById = async (id:string) => {
  const response = await fetch(`${apilocal}/organizations/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result
};

export const fetchOrgCreate = async (createOrg: CreateOrg) => {
  const response = await fetch(`${apilocal}/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createOrg)
  });

  const result = await response.json();
  return result
};

export const fetchSubsCreate = async (createSubs: CreateSubs) => {
  const response = await fetch(`${apilocal}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createSubs)
  });

  const result = await response.json();
  return result
};



export const fetchFindAllPlans = async ()=>{
  const response = await fetch(`${apilocal}/plans`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result
}
