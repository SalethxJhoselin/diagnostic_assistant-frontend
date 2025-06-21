import { IconBoxes, IconSearch } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import type { Organization } from "@/lib/interfaces";
import { fetchOrganizationsByUser, fetchOrgById, fetchOrgCreate, fetchSubsCreate, fetchOrganizationsMembershipsByUserEmail, type CreateOrg, type CreateSubs } from "@/services/organizations.services";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrganizationMembership {
    id: string;
    role: string;
    organizationId: string;
    userId: string;
    organization: Organization;
}

export default function Organizations() {
    const { handleSetOrganization } = useOrganization();
    const [organizations, setOrganizations] = useState<Organization[]>();
    const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>();
    const [memberOrganizations, setMemberOrganizations] = useState<OrganizationMembership[]>();
    const [filteredMemberOrganizations, setFilteredMemberOrganizations] = useState<OrganizationMembership[]>();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    //const [selectedPlan, setSelectedPlan] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [memberSearchQuery, setMemberSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const selectedPlan = location.state?.selectedPlan;
    const orgName = location.state?.orgName;

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    // Obtener organizaciones donde es host
                    const hostResult = await fetchOrganizationsByUser(
                        user.primaryEmailAddress?.emailAddress || '',
                        true
                    );
                    setOrganizations(hostResult);
                    setFilteredOrganizations(hostResult);

                    // Obtener organizaciones donde es miembro
                    const memberResult = await fetchOrganizationsMembershipsByUserEmail(
                        user.primaryEmailAddress?.emailAddress || ''
                    );
                    console.log("TEst"+user.id);
                    console.log(user);
                    setMemberOrganizations(memberResult);
                    setFilteredMemberOrganizations(memberResult);
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

    useEffect(() => {
        if (memberOrganizations) {
            const filtered = memberOrganizations.filter(membership =>
                membership.organization.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                membership.organization.subscriptions?.[0]?.plan?.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
            );
            setFilteredMemberOrganizations(filtered);
        }
    }, [memberSearchQuery, memberOrganizations]);

    const handleClickOrganization = (organization: Organization) => {
        handleSetOrganization(organization);
        navigate(`/dashboard/org/${organization.id}`);
    };

    const handleOpenDialog = () => {
        if (!selectedPlan || !orgName) {
            navigate("/dashboard/plans");
            return;
        }
        setName(orgName);
        setOpen(true);
    };

    const handleCreateOrganization = async () => {
        if (!selectedPlan || !orgName) {
            navigate("/dashboard/plans");
            return;
        }

        const newOrg: CreateOrg = {
            name: orgName,
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
        toast.success(`Organización ${orgName} creada exitosamente`);
    };

    return (
        <>
            <div className="flex flex-col xl:mx-46 md:mx-25 sm:mx-20 mx-6">
                {/* Sección de Organizaciones Propias */}
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
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap gap-6 py-10">
                    {filteredOrganizations?.map((organization) => (
                        <article
                            onClick={() => handleClickOrganization(organization)}
                            key={organization.id}
                            className="sm:w-[370px] w-full px-5 py-4 gap-4 items-center group 
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

                {/* Sección de Organizaciones como Miembro */}
                <section className="flex flex-col sm:mt-10 mt-4 sm:gap-y-8 gap-y-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary 
                        to-primary/60 bg-clip-text text-transparent py-2">
                        Organizaciones como Miembro
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                        <div className="flex items-center relative group">
                            <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
                                <IconSearch />
                            </div>
                            <input
                                className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
                                type="search"
                                placeholder="Buscar por nombre o plan..."
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap gap-6 py-10">
                    {filteredMemberOrganizations?.map((membership) => (
                        <article
                            onClick={() => handleClickOrganization(membership.organization)}
                            key={membership.id}
                            className="sm:w-[370px] w-full px-5 py-4 gap-4 items-center group 
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
                                        {membership.organization.name}
                                    </h2>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {membership.organization.subscriptions?.[0]?.plan?.name || 'Sin plan'}
                                        </p>
                                        <p className="text-xs text-primary">
                                            Rol: {membership.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                    {filteredMemberOrganizations?.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No se encontraron organizaciones que coincidan con tu búsqueda
                            </p>
                        </div>
                    )}
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
                                <h2 className="text-md font-semibold">Crear una nueva organización</h2>
                            </div>
                            <section className="flex flex-col px-6 py-3">
                                <div className="flex justify-between pb-4">
                                    <h2 className="font-semibold">Nombre</h2>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            className="w-full sm:w-sm px-2 py-1 border rounded-md"
                                            type="text"
                                            placeholder="Nombre de la organización"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <span className="text-sm">
                                            ¿Cuál es el nombre de tu empresa o equipo?
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
