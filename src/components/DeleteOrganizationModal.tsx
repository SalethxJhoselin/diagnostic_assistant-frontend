import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { fetchDeleteOrganization } from "@/services/organizations.services";
import { useNavigate } from "react-router-dom";
import BaseModal from "@/components/ui/BaseModal";

interface DeleteOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationName: string;
    organizationId: string;
}

export default function DeleteOrganizationModal({
    isOpen,
    onClose,
    organizationName,
    organizationId,
}: DeleteOrganizationModalProps) {
    const [confirmationText, setConfirmationText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (confirmationText !== organizationName) return;

        try {
            setIsDeleting(true);
            await fetchDeleteOrganization(organizationId);
            navigate("/dashboard/organizations");
        } catch (error) {
            console.error("Error al eliminar la organización:", error);
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                Cancelar
            </Button>
            <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmationText !== organizationName || isDeleting}
            >
                {isDeleting ? "Eliminando..." : "Eliminar Organización"}
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Eliminar Organización
                </div>
            }
            footer={modalFooter}
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a la organización.
                </p>
                <div className="p-4 bg-destructive/10 rounded-lg">
                    <p className="text-sm text-destructive">
                        Para confirmar, escriba el nombre de la organización: <strong>{organizationName}</strong>
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmation">Confirmación</Label>
                    <Input
                        id="confirmation"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Escriba el nombre de la organización"
                    />
                </div>
            </div>
        </BaseModal>
    );
} 