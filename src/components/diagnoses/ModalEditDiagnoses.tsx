import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchDiagnosesByOrg, fetchUpdateDiagnoses, type GetDiagnoses } from "@/services/diagnoses.services";

interface ModalEditDiagProps {
    setEditDiagnose: React.Dispatch<React.SetStateAction<GetDiagnoses | null>>;
    setDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
    setFilteredDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
    editDiagnose: GetDiagnoses;
}

export default function ModalEditDiag({ setEditDiagnose, setDiagnoses, setFilteredDiagnoses,
    editDiagnose }: ModalEditDiagProps) {
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
            creationDate:editDiagnose.creationDate,
            description,
            organizationId: organization.id,
        };
        try {
            await fetchUpdateDiagnoses(updatedDiagnose);
            const updatedDiagnoses = await fetchDiagnosesByOrg(organization.id);
            setDiagnoses(updatedDiagnoses);
            setFilteredDiagnoses(updatedDiagnoses);
            setEditDiagnose(null);
            toast.success("Diagnostico actualizado correctamente");
        } catch (error) {
            console.error("Error updating treatment:", error);
            toast.error("Error al actualizar Diagnostico");
        }
    }
    return (

        <div
            className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex items-center justify-center"
            onClick={() => setEditDiagnose(null)}
        >
            <div
                className="bg-white dark:bg-secondary rounded-md shadow-xl w-full sm:w-xl mx-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b px-6 py-3">
                    <h2 className="text-md font-semibold">Editar Diagnostico</h2>
                </div>
                <section className="flex flex-col px-6 py-3">
                    <div className="flex flex-col gap-4 pb-4">
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
                </section>
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <button
                        className="border rounded-md px-4 py-1 text-[14px]
                        cursor-pointer transition-all font-semibold hover:bg-secondary"
                        onClick={() => setEditDiagnose(null)}
                    >
                        Cancelar
                    </button>
                    <Button
                        className="text-white cursor-pointer"
                        onClick={handleEditDiagnose}
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </div>
    )
}