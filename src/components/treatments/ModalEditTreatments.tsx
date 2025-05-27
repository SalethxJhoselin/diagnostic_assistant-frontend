import { fetchTreatmentsByOrg, fetchUpdateTreatments, type GetTreatments } from "@/services/treatments.services";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useOrganization } from "@/hooks/organizationContex";

interface ModalEditTreatProps {
    setEditTreatment: React.Dispatch<React.SetStateAction<GetTreatments | null>>;
    setTreatments: React.Dispatch<React.SetStateAction<GetTreatments[]>>;
    setFilteredTreatments: React.Dispatch<React.SetStateAction<GetTreatments[]>>;
    editTreatment: GetTreatments;
}

export default function ModalEditTreat({ setEditTreatment, setTreatments, setFilteredTreatments,
    editTreatment }: ModalEditTreatProps) {
    const { organization } = useOrganization();

    const [description, setDescription] = useState(editTreatment.description);
    const [instructions, setInstructions] = useState(editTreatment.instructions);
    const [duration, setDuration] = useState(editTreatment.duration);
    const durationOptions = ["3 days", "5 days", "1 week", "2 weeks", "1 month"];
    const maxInstructionsLength = 500;

    const handleEditTreatment = async () => {
        if (!organization) {
            toast.error("Organización no encontrada");
            return;
        }
        const updatedTreatment = {
            id: editTreatment.id,
            description,
            duration,
            instructions,
            organizationId: organization.id,
        };
        try {
            await fetchUpdateTreatments(updatedTreatment);
            const updatedTreatments = await fetchTreatmentsByOrg(organization.id);
            setTreatments(updatedTreatments);
            setFilteredTreatments(updatedTreatments);
            setEditTreatment(null);
            toast.success("Tratamiento actualizado correctamente");
        } catch (error) {
            console.error("Error updating treatment:", error);
            toast.error("Error al actualizar tratamiento");
        }
    }
    return (

        <div
            className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex items-center justify-center"
            onClick={() => setEditTreatment(null)}
        >
            <div
                className="bg-white dark:bg-secondary rounded-md shadow-xl w-full sm:w-xl mx-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b px-6 py-3">
                    <h2 className="text-md font-semibold">Editar Tratamiento</h2>
                </div>
                <section className="flex flex-col px-6 py-3">
                    <div className="flex flex-col gap-4 pb-4">
                        <div>
                            <label className="font-semibold">Descripción</label>
                            <input
                                type="text"
                                className="w-full px-2 py-1 border rounded-md"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Duración</label>
                            <select
                                className="w-full px-2 py-1 border rounded-md"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            >
                                <option value="">Seleccione una duración</option>
                                {durationOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold">Instrucciones</label>
                            <textarea
                                className="w-full px-2 py-1 border rounded-md"
                                rows={3}
                                value={instructions}
                                onChange={(e) => {
                                    if (e.target.value.length <= maxInstructionsLength) {
                                        setInstructions(e.target.value);
                                    }
                                }}
                            />
                            <p className="text-sm text-gray-500">
                                {instructions.length}/{maxInstructionsLength} caracteres
                            </p>
                        </div>
                    </div>
                </section>
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <button
                        className="border rounded-md px-4 py-1 text-[14px]
                        cursor-pointer transition-all font-semibold hover:bg-secondary"
                        onClick={() => setEditTreatment(null)}
                    >
                        Cancelar
                    </button>
                    <Button
                        className="text-white cursor-pointer"
                        onClick={handleEditTreatment}
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </div>
    )
}