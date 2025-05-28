import { fetchSignIn, type SignInDto } from "@/services/auth";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SyncUserWithBackend() {
  const { user } = useUser();

  const handleFecthSignIn = async (signInDto: SignInDto) => {
    try {
      const result = await fetchSignIn(signInDto)
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
      const email = user.primaryEmailAddress?.emailAddress;
      //marca para no repetir
      const alreadySynced = localStorage.getItem("user_synced");

      if (!alreadySynced) {
        const signInDto: SignInDto = {
            email: email||'',
            password: '',
            auth_provider: 'google'
        }
        handleFecthSignIn(signInDto);
      }
    }
  }, [user]);

  return null;
}
