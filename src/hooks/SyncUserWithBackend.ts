import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SyncUserWithBackend() {
    const { user } = useUser();

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
                try {
                    //const response = await fetch(input)
                    toast("user guardado")
                    localStorage.setItem("user_synced", "true");
                } catch (error) {
                    toast.error(`Error: ${(error instanceof Error ? error.message : String(error))}`);
                }
            }
        }
    }, [user]);

    return null;
}
