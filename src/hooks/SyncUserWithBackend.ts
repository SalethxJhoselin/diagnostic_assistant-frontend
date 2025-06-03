import { fetchSignIn, type SignInDto } from "@/services/auth";
import type { User } from "@/services/usuarioServices";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { useOrganization } from "./organizationContex";

interface token {
  user:User
  exp: number;
  iat: number;
}

export default function SyncUserWithBackend() {
  const { user } = useUser();
  const { setUser } = useOrganization()

  const handleFecthSignIn = async (signInDto: SignInDto) => {
    try {
      const result = await fetchSignIn(signInDto);
      const token = result.access_token
      const decoded:token = jwtDecode(token)
      setUser(decoded.user)
      console.log(result);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const signInDto: SignInDto = {
        email: email || "",
        password: "",
        auth_provider: "google",
      };
      handleFecthSignIn(signInDto);
    }
  }, [user]);

  return null;
}
