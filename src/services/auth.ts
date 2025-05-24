import { apilocal } from "./api";

export interface SignInDto {
  email: string;
  password: string | null;
  auth_provider: string;
}

export const fetchSignIn = async (signInDto: SignInDto) => {
  const response = await fetch(`${apilocal}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signInDto),
  });

  const result = await response.json();
  return result
};
