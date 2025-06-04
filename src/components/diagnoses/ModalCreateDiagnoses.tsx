import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchCreateDiagnoses, type CreateDiagnoses, type GetDiagnoses } from "@/services/diagnoses.services";
import BaseModal from "@/components/ui/BaseModal";

interface ModalCreateDiagProps {
    isOpen: boolean;
    onClose: () => void;
    setDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
    setFilteredDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
}

export default function ModalCreateDiag(
    { isOpen, onClose, setDiagnoses, setFilteredDiagnoses }: ModalCreateDiagProps
) {
    const { organization } = useOrganization();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const maxDescriptionsLength = 500;

    const handleCreateDiagnoses = async () => {
        if (!organization) return;
        if (!description  || !name) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        const newTreatment: CreateDiagnoses = {
            name,
            description,
            organizationId: organization.id
        };

        const createPromise = new Promise(async (resolve, reject) => {
            try {
                const result = await fetchCreateDiagnoses(newTreatment);
                resolve("success");
                setDiagnoses(prev => [...prev, result]);
                setFilteredDiagnoses(prev => [...prev, result]);
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(createPromise, {
            loading: "Creando diagnostico...",
            success: "diagnostico creado correctamente",
            error: "Error al crear diagnostico",
        });

        try {
            await createPromise;
            onClose();
            setDescription("");
            setName("");
        } catch (error) {
            console.error("Error al crear diagnostico", error);
        }
    };

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
                Cancelar
            </Button>
            <Button onClick={handleCreateDiagnoses}>
                Guardar diagnostico
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear diagnostico"
            footer={modalFooter}
            size="lg"
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label className="font-semibold">Nombre</label>
                    <input
                        type="text"
                        className="w-full px-2 py-1 border rounded-md"
                        placeholder="Descripción del diagnostico"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="font-semibold">Descripcion</label>
                    <textarea
                        className="w-full px-2 py-1 border rounded-md"
                        rows={3}
                        placeholder="Ej: No comer antes de..."
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