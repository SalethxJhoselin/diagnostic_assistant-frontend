import { fetchCreateTreatment, type CreateTreatment, type GetTreatments } from "@/services/treatments.services";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import BaseModal from "@/components/ui/BaseModal";

interface ModalCreateTreatProps {
    isOpen: boolean;
    onClose: () => void;
    setTreatments: React.Dispatch<React.SetStateAction<GetTreatments[]>>;
    setFilteredTreatments: React.Dispatch<React.SetStateAction<GetTreatments[]>>;
}

export default function ModalCreateTreat(
    { isOpen, onClose, setTreatments, setFilteredTreatments }: ModalCreateTreatProps
) {
    const { organization } = useOrganization();
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [duration, setDuration] = useState("");
    const durationOptions = ["3 days", "5 days", "1 week", "2 weeks", "1 month"];
    const [frequencyValue, setFrequencyValue] = useState(1)
    const [frequencyUnit, setFrequencyUnit] = useState("")
    const frequencyUnitOptions = ["daily", "weekly", "monthly"]
    const maxInstructionsLength = 500;

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
            organizationId: organization.id,
            frequencyValue,
            frequencyUnit
        };

        const createPromise = new Promise(async (resolve, reject) => {
            try {
                const result = await fetchCreateTreatment(newTreatment);
                resolve("success");
                setTreatments(prev => [...prev, result]);
                setFilteredTreatments(prev => [...prev, result]);
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
            onClose();
            setDescription("");
            setDuration("");
            setInstructions("");
        } catch (error) {
            console.error("Error al crear tratamiento", error);
        }
    };

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
                Cancelar
            </Button>
            <Button onClick={handleCreateTreatment}>
                Guardar Tratamiento
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear tratamiento"
            footer={modalFooter}
            size="lg"
        >
            <div className="flex flex-col gap-4">
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
                    <Select value={duration} onValueChange={(val) => setDuration(val)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione una duracion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Duracion</SelectLabel>
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
                            className="w-full px-2 py-1 border rounded-md outline-none"
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
                        placeholder="Ej: No comer antes de..."
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