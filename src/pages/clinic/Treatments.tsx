import { IconSearch } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchCreateTreatment, fetchDeleteTreatments, fetchTreatmentsByOrg, type CreateTreatment, type GetTreatments } from "@/services/treatments";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Treatments() {
    const [searchQuery, setSearchQuery] = useState("");
    const [treatments, setTreatments] = useState<GetTreatments[]>([]);
    const [filteredTreatments, setFilteredTreatments] = useState<GetTreatments[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [instructions, setInstructions] = useState("");


    const { organization } = useOrganization()

    useEffect(() => {
        const fetchData = async () => {
            if (!organization) return;
            try {
                const treatments = await fetchTreatmentsByOrg(organization.id);
                console.log(treatments);
                setTreatments(treatments);
                setFilteredTreatments(treatments);
            } catch (error) {
                console.error("Error fetching treatments:", error);
            }
        };
        fetchData();
    }, [organization])

    useEffect(() => {
        const filteredTreatments = treatments.filter(treatment =>
            treatment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            treatment.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
            treatment.instructions.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTreatments(filteredTreatments);
    }, [searchQuery, treatments])

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
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
            setSelectedIds([]);
            setFilteredTreatments(prev =>
                prev.filter(treatment => !selectedIds.includes(treatment.id))
            );
        } catch (error) {
            console.error("Error deleting treatments:", error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCreateTreatment = async () => {
        if (!organization) return;
        if (!description || !duration || !instructions) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        const newTreatment: CreateTreatment = {
            description,
            duration,
            instructions,
            organizationId: organization.id
        }

        const createPromise = new Promise(async (resolve, reject) => {
            try {
                const result = await fetchCreateTreatment(newTreatment);
                resolve("success");
                setTreatments(prev => [...prev, result]);
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(createPromise, {
            loading: "Creando tratamiento...",
            success: "Tratamiento creado correctamente",
            error: "Error al crear tratamiento",
        });

        try {
            await createPromise;
            setOpenModal(false);
            setDescription("");
            setDuration("");
            setInstructions("");
        } catch (error) {
            console.error("Error al crear tratamiento", error);
        }
    };


    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <section className="mb-8">
                <h1 className="text-2xl mb-4 font-semibold">Tratamientos</h1>
                <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                    <Button
                        className="hover:bg-primary/90 border-zinc-400 px-6 py-2 
                             cursor-pointer animate-fade-in-left"
                        onClick={handleOpenModal}
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
                    {
                        selectedIds.length > 0 && (
                            <Button
                                className="hover:bg-pink-700 bg-pink-600 text-white px-6 py-2
                                 cursor-pointer animate-fade-in-left"
                                onClick={handleDelete}
                            >
                                Eliminar {selectedIds.length} Tratamiento(s)
                            </Button>
                        )
                    }
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
                            <th className="text-left px-4 py-2 border-r">Descripción</th>
                            <th className="text-left px-4 py-2 border-r">Duración</th>
                            <th className="text-left px-4 py-2 ">Instrucción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTreatments.map((treatment) => (
                            <tr key={treatment.id} className="group">
                                <td className="px-4 py-3 border text-center group-hover:border-zinc-400
                                 transition-colors duration-200 animate-fade-in-up">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(treatment.id)}
                                        onChange={() => toggleSelect(treatment.id)}
                                    />
                                </td>
                                <td className="px-4 py-3 border group-hover:border-zinc-400
                                 transition-colors duration-200 animate-fade-in-up">
                                    {treatment.description}
                                </td>
                                <td className="px-4 py-3 border group-hover:border-zinc-400
                                 transition-colors duration-200 animate-fade-in-up">
                                    {treatment.duration}
                                </td>
                                <td className="px-4 py-3 border group-hover:border-zinc-400
                                 transition-colors duration-200 animate-fade-in-up">
                                    {treatment.instructions}
                                </td>
                            </tr>
                        ))}
                    </tbody>



                </table>
            </div>
            {openModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex items-center justify-center"
                    onClick={() => setOpenModal(false)}
                >
                    <div
                        className="bg-secondary rounded-md shadow-xl w-full sm:w-xl mx-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b px-6 py-3">
                            <h2 className="text-md font-semibold">Crear tratamiento</h2>
                        </div>
                        <section className="flex flex-col px-6 py-3">
                            <div className="flex flex-col gap-4 pb-4">
                                <div>
                                    <label className="font-semibold">Descripción</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 border rounded-md"
                                        placeholder="Descripción del tratamiento"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold">Duración</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 border rounded-md"
                                        placeholder="Ej: 30 minutos"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold">Instrucciones</label>
                                    <textarea
                                        className="w-full px-2 py-1 border rounded-md"
                                        rows={3}
                                        placeholder="Ej: No comer antes de..."
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>
                        <div className="border-t px-6 py-3 flex items-center justify-between">
                            <button
                                className="border border-zinc-500 rounded-md px-4 py-1 text-[14px] hover:bg-zinc-600 transition-all font-semibold"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancelar
                            </button>
                            <Button
                                className="text-white cursor-pointer"
                                onClick={handleCreateTreatment}
                            >
                                Guardar Tratamiento
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
