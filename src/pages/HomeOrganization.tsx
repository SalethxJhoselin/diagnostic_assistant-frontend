import { useOrganization } from "@/hooks/organizationContex";
import { useParams } from "react-router-dom"

export default function HomeOrganization(){
    const {id} = useParams()
    const  {organization}  = useOrganization()
    console.log(organization);
    console.log(id);
    
    return(
        <>
            <div>
                
            </div>
        </>
    )
}