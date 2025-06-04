import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCreateMember, type CreateOrganizationMember } from "@/services/organizations-members";
import { toast } from "sonner";
import { fetchUserByEmail } from "@/services/usuarioServices";
import BaseModal from "@/components/ui/BaseModal";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  organizationId: string;
}

export default function AddMemberModal({ isOpen, onClose, onCreated, organizationId }: AddMemberModalProps) {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (e.target.value.trim() !== "") {
      try {
        const user = await fetchUserByEmail(e.target.value);
        if (user && user.id) {
          setUserId(user.id);
        } else {
          setUserId("");
        }
      } catch (error) {
        console.error("Error buscando el usuario:", error);
        setUserId("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim() || !role.trim()) {
      toast.error("Por favor completa todos los campos o selecciona un email válido");
      return;
    }

    setLoading(true);

    try {
      const newMember: CreateOrganizationMember = {
        organizationId,
        userId,
        role,
      };
      await fetchCreateMember(newMember);
      toast.success("Miembro añadido correctamente");
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creando miembro:", error);
      toast.error("No se pudo crear el miembro");
    } finally {
      setLoading(false);
    }
  };

  const modalFooter = (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Añadir Miembro"
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Email Usuario:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="border rounded px-2 py-1 mt-1"
            placeholder="Email del usuario"
            disabled={loading}
          />
        </label>
        <label className="flex flex-col">
          Rol:
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1 mt-1"
            placeholder="Rol del miembro"
            disabled={loading}
          />
        </label>
      </form>
    </BaseModal>
  );
}
