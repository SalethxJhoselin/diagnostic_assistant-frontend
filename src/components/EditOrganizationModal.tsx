import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchUpdateOrganization } from "@/services/organizations.services";
import BaseModal from "@/components/ui/BaseModal";

interface EditOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationName: string;
    organizationId: string;
    onUpdated: () => void;
}

export default function EditOrganizationModal({
    isOpen,
    onClose,
    organizationName,
    organizationId,
    onUpdated
}: EditOrganizationModalProps) {
    const [newName, setNewName] = useState(organizationName);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setNewName(organizationName);
    }, [organizationName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newName.trim()) {
            toast.error("El nombre no puede estar vacío");
            return;
        }

        if (newName === organizationName) {
            toast.info("No se han realizado cambios");
            onClose();
            return;
        }

        try {
            setIsUpdating(true);
            await fetchUpdateOrganization(organizationId, { name: newName });
            await onUpdated();
            onClose();
        } catch (error) {
            console.error("Error al actualizar la organización:", error);
            toast.error("Error al actualizar la organización");
        } finally {
            setIsUpdating(false);
        }
    };

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isUpdating}>
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Organización"
            footer={modalFooter}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="organizationName">Nombre de la Organización</Label>
                    <Input
                        id="organizationName"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ingrese el nuevo nombre"
                        disabled={isUpdating}
                        autoFocus
                    />
                </div>
            </form>
        </BaseModal>
    );
} 