import { fetchTreatmentsByOrg, fetchUpdateTreatments, type GetTreatments } from "@/services/treatments.services";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useOrganization } from "@/hooks/organizationContex";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

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
    const durationOptions = ["3 dias", "5 días", "1 semana", "2 semanas", "1 mes"];
    const [frequencyValue, setFrequencyValue] = useState(editTreatment.frequencyValue)
    const [frequencyUnit, setFrequencyUnit] = useState(editTreatment.frequencyUnit)
    const frequencyUnitOptions = ["daily", "weekly", "monthly"]
    const maxInstructionsLength = 500;

    const handleEditTreatment = async () => {
        if (!organization) {
            toast.error("Organización no encontrada");
            return;
        }
        if (!description || !instructions || !duration || !frequencyValue || !frequencyUnit) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        const updatedTreatment = {
            description,
            duration,
            instructions,
            organizationId: organization.id,
            frequencyValue,
            frequencyUnit
        };

        const editPromise = new Promise(async (resolve, reject) => {
            try {
                const result = await fetchUpdateTreatments(editTreatment.id, updatedTreatment);
                resolve("success");
                setTreatments(prev => prev.map(treatment => treatment.id === editTreatment.id ? result : treatment));
                setFilteredTreatments(prev => prev.map(treatment => treatment.id === editTreatment.id ? result : treatment));
            } catch (error) {
                reject(error);
            }
        })
        toast.promise(editPromise, {
            loading: "Actualizando tratamiento...",
            success: "Tratamiento actualizado correctamente",
            error: "Error al actualizar tratamiento",
        });
        try {
            await editPromise;
            const updatedTreatments = await fetchTreatmentsByOrg(organization.id);
            setTreatments(updatedTreatments);
            setFilteredTreatments(updatedTreatments);
            setEditTreatment(null);
        } catch (error) {
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
                            <Select value={duration} onValueChange={(val) => setDuration(val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una duración" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Duración</SelectLabel>
                                        {
                                            durationOptions.map((item, index) => (
                                                <SelectItem key={index} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col w-[250px] gap-2">
                                <label className="font-semibold">Frecuencia del tratamiento</label>
                                <Select value={frequencyUnit} onValueChange={(val) => setFrequencyUnit(val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione una frecuencia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Frecuencia</SelectLabel>
                                            {
                                                frequencyUnitOptions.map((item, index) => (
                                                    <SelectItem key={index} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-[200px] gap-2">
                                <label className="font-semibold">Intervalos</label>
                                <input
                                    type="number"
                                    className="w-full px-2 py-1 border rounded-md outline-none "
                                    placeholder="Descripción del tratamiento"
                                    value={frequencyValue}
                                    onChange={(e) => setFrequencyValue(Number(e.target.value))}
                                />
                            </div>
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