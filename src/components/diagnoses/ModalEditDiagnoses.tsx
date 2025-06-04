import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchDiagnosesByOrg, fetchUpdateDiagnoses, type GetDiagnoses } from "@/services/diagnoses.services";
import BaseModal from "@/components/ui/BaseModal";

interface ModalEditDiagProps {
    isOpen: boolean;
    onClose: () => void;
    setDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
    setFilteredDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
    editDiagnose: GetDiagnoses;
}

export default function ModalEditDiag({ 
    isOpen, 
    onClose, 
    setDiagnoses, 
    setFilteredDiagnoses,
    editDiagnose 
}: ModalEditDiagProps) {
    const { organization } = useOrganization();

    const [name, setName] = useState(editDiagnose.name);
    const [description, setDescription] = useState(editDiagnose.description);
    const maxDescriptionsLength = 500;

    const handleEditDiagnose = async () => {
        if (!organization) {
            toast.error("Organización no encontrada");
            return;
        }
        const updatedDiagnose = {
            id: editDiagnose.id,
            name,
            creationDate: editDiagnose.creationDate,
            description,
            organizationId: organization.id,
        };
        try {
            await fetchUpdateDiagnoses(updatedDiagnose);
            const updatedDiagnoses = await fetchDiagnosesByOrg(organization.id);
            setDiagnoses(updatedDiagnoses);
            setFilteredDiagnoses(updatedDiagnoses);
            onClose();
            toast.success("Diagnostico actualizado correctamente");
        } catch (error) {
            console.error("Error updating treatment:", error);
            toast.error("Error al actualizar Diagnostico");
        }
    }

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
                Cancelar
            </Button>
            <Button onClick={handleEditDiagnose}>
                Guardar Cambios
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Diagnostico"
            footer={modalFooter}
            size="lg"
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label className="font-semibold">Nombre</label>
                    <input
                        type="text"
                        className="w-full px-2 py-1 border rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="font-semibold">Descripción</label>
                    <textarea
                        className="w-full px-2 py-1 border rounded-md"
                        rows={3}
                        value={description}
                        onChange={(e) => {
                            if (e.target.value.length <= maxDescriptionsLength) {
                                setDescription(e.target.value);
                            }
                        }}
                    />
                    <p className="text-sm text-gray-500">
                        {description.length}/{maxDescriptionsLength} caracteres
                    </p>
                </div>
            </div>
        </BaseModal>
    );
}