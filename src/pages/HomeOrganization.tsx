import { useOrganizations } from "@/hooks/organizationContex"
import { useParams } from "react-router-dom"

export default function HomeOrganization(){
    const {id} = useParams()
    const  organizations  = useOrganizations()
    console.log(organizations);
    console.log(id);
    
    return(
        <>
            <div>
                
            </div>
        </>
    )
}