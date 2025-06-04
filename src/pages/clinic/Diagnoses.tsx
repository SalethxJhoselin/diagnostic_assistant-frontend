import { IconSearch } from "@/assets/icons";
import ModalCreateDiag from "@/components/diagnoses/ModalCreateDiagnoses";
import ModalEditDiag from "@/components/diagnoses/ModalEditDiagnoses";
import ModalConfirmation from "@/components/ModalConfirmation";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchDeleteDiagnoses, fetchDiagnosesByOrg, type GetDiagnoses } from "@/services/diagnoses.services";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Diagnoses() {
    const [searchQuery, setSearchQuery] = useState("");
    const [diagnoses, setDiagnoses] = useState<GetDiagnoses[]>([]);
    const [filteredDiagnoses, setFilteredDiagnoses] = useState<GetDiagnoses[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editDiagnose, setEditDiagnose] = useState<GetDiagnoses | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sortField, setSortField] = useState<"name" | "description">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { organization } = useOrganization();

    useEffect(() => {
        const fetchData = async () => {
            if (!organization) return;
            setIsLoading(true);
            try {
                const diagnoses = await fetchDiagnosesByOrg(organization.id);
                setDiagnoses(diagnoses);
                setFilteredDiagnoses(diagnoses);
            } catch (error) {
                console.error("Error fetching diagnoses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [organization]);

    useEffect(() => {
        let sortedDiagnoses = [...diagnoses].sort((a, b) => {
            const fieldA = a[sortField].toLowerCase();
            const fieldB = b[sortField].toLowerCase();
            return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
        });

        sortedDiagnoses = sortedDiagnoses.filter(diagnose =>
            diagnose.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            diagnose.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredDiagnoses(sortedDiagnoses);
    }, [searchQuery, diagnoses, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredDiagnoses.length / itemsPerPage);
    const paginatedDiagnoses = filteredDiagnoses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const handleSort = (field: "description" | "name" ) => {
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
            selectedIds.map(id => fetchDeleteDiagnoses(id))
        );

        toast.promise(promise, {
            loading: "Eliminando diagnosticos...",
            success: "diagnosticos eliminados correctamente",
            error: "Hubo un error al eliminar los diagnosticos",
        });

        try {
            await promise;
            if (!organization) return;
            const updatedDiagnoses = await fetchDiagnosesByOrg(organization.id);
            setOpenModalConfirmation(false);
            setDiagnoses(updatedDiagnoses);
            setFilteredDiagnoses(updatedDiagnoses);
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting diagnoses:", error);
        }
    };



    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <section className="mb-8">
                <h1 className="text-2xl mb-4 font-semibold">diagnosticos</h1>
                <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                    <Button
                        className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left"
                        onClick={() => setOpenModal(true)}
                    >
                        Nuevo Diagnostico
                    </Button>

                    <div className="flex items-center relative group">
                        <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
                            <IconSearch />
                        </div>
                        <input
                            className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
                            type="search"
                            placeholder="Buscar por nombre o descripcion..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <Button
                            className="hover:bg-pink-700 bg-pink-600 text-white px-6 py-2 cursor-pointer animate-fade-in-left"
                            onClick={() => setOpenModalConfirmation(true)}
                        >
                            Eliminar {selectedIds.length} Diagnostico(s)
                        </Button>
                    )}
                </div>
            </section>
            <div className="w-full overflow-x-auto border rounded-md">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-secondary border-b">
                        <tr>
                            <th className="w-[40px] text-center px-4 py-2 border-r">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredDiagnoses.length && filteredDiagnoses.length > 0}
                                    onChange={() => {
                                        if (selectedIds.length === filteredDiagnoses.length) {
                                            setSelectedIds([]);
                                        } else {
                                            setSelectedIds(filteredDiagnoses.map(diagnose => diagnose.id));
                                        }
                                    }}
                                />
                            </th>
                            <th className="w-[300px] text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("name")}>
                                Nombre {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("description")}>
                                Descripción {sortField === "description" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="w-[120px] text-left px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    <span>
                                        Cargando diagnosticos...
                                    </span>
                                </td>
                            </tr>
                        ) : paginatedDiagnoses.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No se encontraron diagnosticos.
                                </td>
                            </tr>
                        ) : (
                            paginatedDiagnoses.map((diagnose) => (
                                <tr key={diagnose.id} className="group text-[14px]">
                                    <td className="px-4 py-1 border text-center group-hover:border-zinc-400
                                        transition-colors duration-200 animate-fade-in-up">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(diagnose.id)}
                                            onChange={() => toggleSelect(diagnose.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {diagnose.name}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {diagnose.description}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        <Button
                                            className=" border-primary text-primary hover:bg-primary/10"
                                            variant="outline"
                                            onClick={() => {
                                                setEditDiagnose(diagnose);
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
                <ModalCreateDiag
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    setDiagnoses={setDiagnoses}
                    setFilteredDiagnoses={setFilteredDiagnoses}
                />
            )}
            {editDiagnose && (
                <ModalEditDiag
                    isOpen={!!editDiagnose}
                    onClose={() => setEditDiagnose(null)}
                    setDiagnoses={setDiagnoses}
                    setFilteredDiagnoses={setFilteredDiagnoses}
                    editDiagnose={editDiagnose}
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
                    title="Eliminar diagnosticos"
                    message={`¿Estás seguro de eliminar ${selectedIds.length} Diagnostico(s)? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            )

            }
        </div>
    );
}