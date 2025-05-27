import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchCreateDiagnoses, type CreateDiagnoses, type GetDiagnoses } from "@/services/diagnoses.services";

interface ModalCreateDiagProps {
    setOpenModal: (open: boolean) => void;
    setDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
    setFilteredDiagnoses: React.Dispatch<React.SetStateAction<GetDiagnoses[]>>;
}

export default function ModalCreateDiag(
    { setOpenModal, setDiagnoses, setFilteredDiagnoses }: ModalCreateDiagProps
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
            setOpenModal(false);
            setDescription("");
            setName("");
        } catch (error) {
            console.error("Error al crear diagnostico", error);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex items-center justify-center"
            onClick={() => setOpenModal(false)}
        >
            <div
                className="bg-white dark:bg-secondary rounded-md shadow-xl w-full sm:w-xl mx-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b px-6 py-3">
                    <h2 className="text-md font-semibold">Crear diagnostico</h2>
                </div>
                <section className="flex flex-col px-6 py-3">
                    <div className="flex flex-col gap-4 pb-4">
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
                </section>
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <button
                        className="border rounded-md px-4 py-1 text-[14px]
                        cursor-pointer transition-all font-semibold hover:bg-secondary"                        
                        onClick={() => setOpenModal(false)}
                    >
                        Cancelar
                    </button>
                    <Button
                        className="text-white cursor-pointer"
                        onClick={handleCreateDiagnoses}
                    >
                        Guardar diagnostico
                    </Button>
                </div>
            </div>
        </div>
    )
}