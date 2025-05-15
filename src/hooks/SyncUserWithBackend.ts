import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface SignInDto {
  email: string;
  password: string | null;
  auth_provider: string;
}

export default function SyncUserWithBackend() {
  const { user } = useUser();

  const fetchSignIn = async (signInDto: SignInDto) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInDto),
      });

      const result = await response.json()
      console.log(result);
      toast("user guardado");
      localStorage.setItem("user_synced", "true");
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user);

      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.fullName || `${user.firstName} ${user.lastName}`;
      console.log(email);
      console.log(name);
      //marca para no repetir
      const alreadySynced = localStorage.getItem("user_synced");

      if (!alreadySynced) {
        const signInDto: SignInDto = {
            email: email||'',
            password: '',
            auth_provider: 'google'
        }
        fetchSignIn(signInDto);
      }
    }
  }, [user]);

  return null;
}
