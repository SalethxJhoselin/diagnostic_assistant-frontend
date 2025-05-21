import { IconBoxes, IconSearch } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    SelectItem, Select, SelectContent, SelectGroup,
    SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useOrganization } from "@/hooks/organizationContex";
import type { Organization, Plan } from "@/lib/interfaces";
import { fetchFindAllPlans, fetchOrganizationsByUser, fetchOrgById, fetchOrgCreate, fetchSubsCreate, type CreateOrg, type CreateSubs } from "@/services/organizations";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Organizations() {
    const { handleSetOrganization } = useOrganization();
    const [organizations, setOrganizations] = useState<Organization[]>();
    const [plans, setPlans] = useState<Plan[]>();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const navigate = useNavigate();

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const result = await fetchOrganizationsByUser(
                        user.primaryEmailAddress?.emailAddress || '',
                        true
                    );
                    console.log(result);

                    setOrganizations(result);
                }
            } catch (error) {
                toast("error al recuperar tus organizaciones");
            }
        };
        fetchData();
    }, [user]);

    const handleClickOrganization = (organization: Organization) => {
        handleSetOrganization(organization);
        navigate(`/dashboard/org/${organization.id}`);
    };

    const handleOpenDialog = async () => {
        try {
            const result = await fetchFindAllPlans();
            setPlans(result);
            setOpen(true);
        } catch (error) {
            toast('error al traer los planes');
        }
    };

    const handleCreateOrganization = async () => {
        const newOrg: CreateOrg = {
            name: name,
            hostUser: user?.primaryEmailAddress?.emailAddress || ''
        }
        const resultOrg: Organization = await fetchOrgCreate(newOrg)
        const newSubs: CreateSubs = {
            planId: selectedPlan,
            organizationId: resultOrg.id
        }
        await fetchSubsCreate(newSubs)
        const newOrgContex: Organization = await fetchOrgById(resultOrg.id)
        handleSetOrganization(newOrgContex)
        navigate(`/dashboard/org/${resultOrg.id}`)
        toast(`Nombre: ${name || "No ingresado"} | Plan ID: ${selectedPlan || "No seleccionado"}`);
    };

    return (
        <>
            <div className="flex flex-col lg:mx-46 sm:mx-20 mx-6 h-auto">
                <section className="flex flex-col sm:mt-10 mt-4 sm:gap-y-10 gap-y-6">
                    <h1 className="sm:text-3xl text-2xl font-medium">Your Organizations</h1>
                    <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4 ">
                        <Button className="text-white" onClick={handleOpenDialog}>
                            New Organization
                        </Button>
                        <div className="flex items-center relative">
                            <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
                                <IconSearch />
                            </div>
                            <input
                                className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
                                type="search"
                                placeholder="Search for an organization"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex gap-x-5 mt-10 ">
                    {organizations?.map((organization) => (
                        <article
                            onClick={() => handleClickOrganization(organization)}
                            key={organization.id}
                            className="flex w-full lg:w-[370px] border rounded-2xl px-5 py-4 gap-4 items-center
                            bg-secondary cursor-pointer hover:bg-secondary/80 transition-all"
                        >
                            <div className="bg-black text-white rounded-4xl p-1.5">
                                <IconBoxes />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">{organization.name}</h2>
                                <h3 className="text-sm">
                                    {organization.subscriptions?.[0]?.plan?.name || 'Sin plan'}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>

                {open && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex items-center justify-center"
                        onClick={() => setOpen(false)}
                    >
                        <div
                            className="bg-secondary rounded-md shadow-xl w-full sm:w-xl mx-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center border-b px-6 py-3">
                                <h2 className="text-md font-semibold">Create a new organization</h2>
                            </div>
                            <section className="flex flex-col px-6 py-3">
                                <div className="flex justify-between pb-4">
                                    <h2 className="font-semibold">Name</h2>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            className="w-full sm:w-sm px-2 py-1 border rounded-md"
                                            type="text"
                                            placeholder="name to organization"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <span className="text-sm">
                                            What's the name of your company or team?
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between pb-4">
                                    <h2 className="font-semibold">Plan</h2>
                                    <div className="flex flex-col gap-2">
                                        <Select value={selectedPlan} onValueChange={(val) => setSelectedPlan(val)}>
                                            <SelectTrigger className="sm:w-[385px] w-full">
                                                <SelectValue placeholder="Select a plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Plans</SelectLabel>
                                                    {plans?.map((plan) => (
                                                        <SelectItem key={plan.id} value={plan.id}>
                                                            {`${plan.name} - $${plan.price}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-sm">
                                            The Plan applies to your new organization.
                                        </span>
                                    </div>
                                </div>
                            </section>
                            <div className="border-t px-6 py-3 flex items-center justify-between">
                                <button
                                    className="border border-zinc-500 rounded-md px-4 py-1 text-[14px] hover:bg-zinc-600 transition-all font-semibold"
                                    onClick={() => setOpen(false)}
                                >
                                    Cerrar
                                </button>
                                <Button
                                    className="text-white cursor-pointer"
                                    onClick={handleCreateOrganization}
                                >
                                    Create Organization
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
