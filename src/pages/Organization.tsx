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
    const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>();
    const [plans, setPlans] = useState<Plan[]>();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
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
                    setOrganizations(result);
                    setFilteredOrganizations(result);
                }
            } catch (error) {
                toast("Error al recuperar tus organizaciones");
            }
        };
        fetchData();
    }, [user]);

    useEffect(() => {
        if (organizations) {
            const filtered = organizations.filter(org =>
                org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.subscriptions?.[0]?.plan?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredOrganizations(filtered);
        }
    }, [searchQuery, organizations]);

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
            toast('Error al cargar los planes');
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
        toast.success(`Organización creada exitosamente`);
    };

    return (
        <>
            <div className="flex flex-col xl:mx-46 md:mx-25 sm:mx-20 mx-6">
                <section className="flex flex-col sm:mt-10 mt-4 sm:gap-y-8 gap-y-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary 
                        to-primary/60 bg-clip-text text-transparent py-2">
                        Tus Organizaciones
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={handleOpenDialog}
                        >
                            Nueva Organización
                        </Button>

                        <div className="flex items-center relative group">
                            <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
                                <IconSearch />
                            </div>
                            <input
                                className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
                                type="search"
                                placeholder="Buscar por nombre o plan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap gap-6 py-10">
                    {filteredOrganizations?.map((organization) => (
                        <article
                            onClick={() => handleClickOrganization(organization)}
                            key={organization.id}
                            className="sm:w-[400px] xl:w-[420px] w-full px-5 py-4 gap-4 items-center group 
                                  bg-secondary backdrop-blur-sm rounded-xl
                                    border border-gray-400/20 dark:border-gray-700/50 hover:border-primary/50
                                    transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-lg group-hover:bg-primary/20
                                 dark:group-hover:bg-primary/30 transition-colors duration-300">
                                    <IconBoxes />
                                </div>

                                <div className="">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        {organization.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {organization.subscriptions?.[0]?.plan?.name || 'Sin plan'}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                    {filteredOrganizations?.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No se encontraron organizaciones que coincidan con tu búsqueda
                            </p>
                        </div>
                    )}
                </div>

                {open && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Crear Nueva Organización</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre de la Organización
                                        </label>
                                        <input
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            type="text"
                                            placeholder="Ingresa el nombre de tu organización"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            ¿Cuál es el nombre de tu empresa o equipo?
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Plan
                                        </label>
                                        <Select value={selectedPlan} onValueChange={(val) => setSelectedPlan(val)}>
                                            <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                <SelectValue placeholder="Selecciona un plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Planes Disponibles</SelectLabel>
                                                    {plans?.map((plan) => (
                                                        <SelectItem key={plan.id} value={plan.id}>
                                                            {`${plan.name} - $${plan.price}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            El plan se aplicará a tu nueva organización.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200"
                                    onClick={handleCreateOrganization}
                                >
                                    Crear Organización
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
