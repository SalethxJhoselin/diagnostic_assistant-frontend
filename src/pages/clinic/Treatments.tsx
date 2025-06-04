import { IconSearch } from "@/assets/icons";
import ModalConfirmation from "@/components/ModalConfirmation";
import ModalCreateTreat from "@/components/treatments/ModalCreateTreatments";
import ModalEditTreat from "@/components/treatments/ModalEditTreatments";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchDeleteTreatments, fetchTreatmentsByOrg, type GetTreatments } from "@/services/treatments.services";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Treatments() {
    const [searchQuery, setSearchQuery] = useState("");
    const [treatments, setTreatments] = useState<GetTreatments[]>([]);
    const [filteredTreatments, setFilteredTreatments] = useState<GetTreatments[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editTreatment, setEditTreatment] = useState<GetTreatments | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sortField, setSortField] = useState<"description" | "duration" | "instructions">("description");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { organization } = useOrganization();

    useEffect(() => {
        const fetchData = async () => {
            if (!organization) return;
            setIsLoading(true);
            try {
                const treatments = await fetchTreatmentsByOrg(organization.id);
                setTreatments(treatments);
                setFilteredTreatments(treatments);
            } catch (error) {
                console.error("Error fetching treatments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [organization]);

    useEffect(() => {
        let sortedTreatments = [...treatments].sort((a, b) => {
            const fieldA = a[sortField].toLowerCase();
            const fieldB = b[sortField].toLowerCase();
            return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
        });

        sortedTreatments = sortedTreatments.filter(treatment =>
            treatment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            treatment.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
            treatment.instructions.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredTreatments(sortedTreatments);
    }, [searchQuery, treatments, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredTreatments.length / itemsPerPage);
    const paginatedTreatments = filteredTreatments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const handleSort = (field: "description" | "duration" | "instructions") => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;
        const promise = Promise.all(
            selectedIds.map(id => fetchDeleteTreatments(id))
        );

        toast.promise(promise, {
            loading: "Eliminando tratamientos...",
            success: "Tratamientos eliminados correctamente",
            error: "Hubo un error al eliminar los tratamientos",
        });

        try {
            await promise;
            if (!organization) return;
            const updatedTreatments = await fetchTreatmentsByOrg(organization.id);
            setOpenModalConfirmation(false);
            setTreatments(updatedTreatments);
            setFilteredTreatments(updatedTreatments);
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting treatments:", error);
        }
    };



    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <section className="mb-8">
                <h1 className="text-2xl mb-4 font-semibold">Tratamientos</h1>
                <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                    <Button
                        className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left"
                        onClick={()=> setOpenModal(true)}
                    >
                        Nuevo Tratamiento
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
                    {selectedIds.length > 0 && (
                        <Button
                            className="hover:bg-pink-700 bg-pink-600 text-white px-6 py-2 cursor-pointer animate-fade-in-left"
                            onClick={() => setOpenModalConfirmation(true)}
                        >
                            Eliminar {selectedIds.length} Tratamiento(s)
                        </Button>
                    )}
                </div>
            </section>
            <div className="w-full overflow-x-auto border rounded-md">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-secondary border-b">
                        <tr>
                            <th className="text-center px-4 py-2 border-r">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredTreatments.length && filteredTreatments.length > 0}
                                    onChange={() => {
                                        if (selectedIds.length === filteredTreatments.length) {
                                            setSelectedIds([]);
                                        } else {
                                            setSelectedIds(filteredTreatments.map(treatment => treatment.id));
                                        }
                                    }}
                                />
                            </th>
                            <th className="text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("description")}>
                                Descripción {sortField === "description" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("duration")}>
                                Duración {sortField === "duration" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("instructions")}>
                                Instrucción {sortField === "instructions" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="text-left px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    <span>
                                        Cargando tratamientos...
                                    </span>
                                </td>
                            </tr>
                        ) : paginatedTreatments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No se encontraron tratamientos.
                                </td>
                            </tr>
                        ) : (
                            paginatedTreatments.map((treatment) => (
                                <tr key={treatment.id} className="group text-[14px]">
                                    <td className="px-4 py-1 border text-center group-hover:border-zinc-400
                                        transition-colors duration-200 animate-fade-in-up">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(treatment.id)}
                                            onChange={() => toggleSelect(treatment.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {treatment.description}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {treatment.duration}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {treatment.instructions}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        <Button
                                            className=" border-primary text-primary hover:bg-primary/10"
                                            variant="outline"
                                            onClick={() => {
                                                setEditTreatment(treatment);
                                            }}
                                        >
                                            Ver/Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between mt-4">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Anterior
                    </Button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
            {openModal && (
                <ModalCreateTreat
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    setTreatments={setTreatments}
                    setFilteredTreatments={setFilteredTreatments}
                />
            )}
            {editTreatment && (
                <ModalEditTreat
                    isOpen={!!editTreatment}
                    onClose={() => setEditTreatment(null)}
                    setTreatments={setTreatments}
                    setFilteredTreatments={setFilteredTreatments}
                    editTreatment={editTreatment}
                />
            )}
            {openModalConfirmation && (

                <ModalConfirmation
                    isOpen={openModalConfirmation}
                    onClose={() => setOpenModalConfirmation(false)}
                    onConfirm={() => {
                        handleDelete();
                        setOpenModal(false);
                    }}
                    title="Eliminar tratamientos"
                    message={`¿Estás seguro de eliminar ${selectedIds.length} tratamiento(s)? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            )

            }
        </div>
    );
}