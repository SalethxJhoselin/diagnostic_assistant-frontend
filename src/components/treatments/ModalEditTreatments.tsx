import { fetchTreatmentsByOrg, fetchUpdateTreatments, type GetTreatments } from "@/services/treatments.services";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useOrganization } from "@/hooks/organizationContex";
import BaseModal from "@/components/ui/BaseModal";

interface ModalEditTreatProps {
    isOpen: boolean;
    onClose: () => void;
    setTreatments: React.Dispatch<React.SetStateAction<GetTreatments[]>>;
    setFilteredTreatments: React.Dispatch<React.SetStateAction<GetTreatments[]>>;
    editTreatment: GetTreatments;
}

export default function ModalEditTreat({ 
    isOpen, 
    onClose, 
    setTreatments, 
    setFilteredTreatments,
    editTreatment 
}: ModalEditTreatProps) {
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
            onClose();
            toast.success("Tratamiento actualizado correctamente");
        } catch (error) {
            console.error("Error updating treatment:", error);
            toast.error("Error al actualizar tratamiento");
        }
    }

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
                Cancelar
            </Button>
            <Button onClick={handleEditTreatment}>
                Guardar Cambios
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Tratamiento"
            footer={modalFooter}
            size="lg"
        >
            <div className="flex flex-col gap-4">
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
        </BaseModal>
    );
}