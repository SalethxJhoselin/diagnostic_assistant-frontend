import { IconSearch } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { fetchConsulByOrg, fetchDeleteConsultation, type GetConsultation } from "@/services/consultations.services";
import { useOrganization } from "@/hooks/organizationContex";

export default function Consultations() {
    const [searchQuery, setSearchQuery] = useState("");
    const [consultations, setConsultations] = useState<GetConsultation[]>([]);
    const [filteredConsultations, setFilteredConsultations] = useState<GetConsultation[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortField, setSortField] = useState<"patientName" | "consultationDate" | "motivo">("consultationDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { organization } = useOrganization();

    useEffect(() => {
        const fetchData = async () => {
            if (!organization) return;
            setIsLoading(true);
            try {
                const consultations = await fetchConsulByOrg(organization.id);
                console.log(consultations);
                setConsultations(consultations);
                setFilteredConsultations(consultations);
            } catch (error) {
                console.error("Error fetching consultations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [organization]);

    useEffect(() => {
        let sortedConsultations = [...consultations].sort((a, b) => {
            const fieldA = sortField === "patientName" ? a.patient.name.toLowerCase() : sortField === "consultationDate" ? a.consultationDate : a.motivo.toLowerCase();
            const fieldB = sortField === "patientName" ? b.patient.name.toLowerCase() : sortField === "consultationDate" ? b.consultationDate : b.motivo.toLowerCase();
            if (sortField === "consultationDate") {
                return sortOrder === "asc" ? new Date(fieldA).getTime() - new Date(fieldB).getTime() : new Date(fieldB).getTime() - new Date(fieldA).getTime();
            }
            return sortOrder === "asc"
                ? String(fieldA).localeCompare(String(fieldB))
                : String(fieldB).localeCompare(String(fieldA));
        });

        sortedConsultations = sortedConsultations.filter(consultation =>
            consultation.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            consultation.motivo.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredConsultations(sortedConsultations);
    }, [searchQuery, consultations, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);
    const paginatedConsultations = filteredConsultations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const handleSort = (field: "patientName" | "consultationDate" | "motivo") => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;

        if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedIds.length} consulta(s)? Esta acción no se puede deshacer.`)) {
            return;
        }

        const promise = Promise.all(
            selectedIds.map(id => fetchDeleteConsultation(id))
        );

        toast.promise(promise, {
            loading: "Eliminando consultas...",
            success: "Consultas eliminadas correctamente",
            error: "Hubo un error al eliminar las consultas",
        });

        try {
            await promise;
            if (!organization) {
                toast.error("Organización no encontrada.");
                return;
            }
            const updatedConsultations = await fetchConsulByOrg(organization.id);
            setConsultations(updatedConsultations);
            setFilteredConsultations(updatedConsultations);
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting consultations:", error);
        }
    };

    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <section className="mb-8">
                <h1 className="text-2xl mb-4 font-semibold">Consultas</h1>
                <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                    {organization && (
                        <Link to={`/dashboard/org/${organization.id}/clinic/consultations/new`}>
                            <Button
                                className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left"
                            >
                                Nueva Consulta
                            </Button>
                        </Link>
                    )}
                    <div className="flex items-center relative group">
                        <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
                            <IconSearch />
                        </div>
                        <input
                            className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
                            type="search"
                            placeholder="Buscar por paciente o motivo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <Button
                            className="hover:bg-pink-700 bg-pink-600 text-white px-6 py-2 cursor-pointer animate-fade-in-left"
                            onClick={handleDelete}
                        >
                            Eliminar {selectedIds.length} Consulta(s)
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
                                    checked={selectedIds.length === filteredConsultations.length && filteredConsultations.length > 0}
                                    onChange={() => {
                                        if (selectedIds.length === filteredConsultations.length) {
                                            setSelectedIds([]);
                                        } else {
                                            setSelectedIds(filteredConsultations.map(consultation => consultation.id));
                                        }
                                    }}
                                />
                            </th>
                            <th className="text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("patientName")}>
                                Paciente {sortField === "patientName" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="w-[100px] text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("consultationDate")}>
                                Fecha {sortField === "consultationDate" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="text-left px-4 py-2 border-r cursor-pointer" onClick={() => handleSort("motivo")}>
                                Motivo {sortField === "motivo" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="text-left px-4 py-2 border-r">Doctor</th>
                            <th className="w-[120px] text-left px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                                </td>
                            </tr>
                        ) : paginatedConsultations.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    No se encontraron consultas.
                                </td>
                            </tr>
                        ) : (
                            paginatedConsultations.map((consultation) => (
                                <tr key={consultation.id} className="group text-[14px]">
                                    <td className="px-4 py-1 border text-center group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(consultation.id)}
                                            onChange={() => toggleSelect(consultation.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {consultation.patient.name}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {new Date(consultation.consultationDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {consultation.motivo}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        {consultation.user.email} {/* Assuming email is the identifier for the doctor */}
                                    </td>
                                    <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                        <Link to={`/consultations/${consultation.id}`}>
                                            <Button variant="outline"
                                                className=" border-primary text-primary hover:bg-primary/10"
                                            >
                                                Ver/Editar
                                            </Button>
                                        </Link>
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
        </div>
    );
}