import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCreateMember, type CreateOrganizationMember } from "@/services/organizations-members";
import { toast } from "sonner";
import { fetchUserByEmail } from "@/services/usuarioServices"; // Importamos la función que llamará al backend

interface AddMemberModalProps {
  organizationId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddMemberModal({ organizationId, onClose, onCreated }: AddMemberModalProps) {
  const [email, setEmail] = useState(""); // Usamos email en lugar de userId
  const [userId, setUserId] = useState(""); // Aquí almacenaremos el userId obtenido
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (e.target.value.trim() !== "") {
      try {
        const user = await fetchUserByEmail(e.target.value); // Llamamos al servicio para obtener el usuario por email
        if (user && user.id) {
          setUserId(user.id); // Asignamos el userId al estado
        } else {
          setUserId(""); // Si no se encuentra el usuario, limpiamos el userId
        }
      } catch (error) {
        console.error("Error buscando el usuario:", error);
        setUserId(""); // Si ocurre algún error, limpiamos el userId
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose} // clic en overlay cierra modal
    >
      <div
        className="bg-white dark:bg-secondary rounded-md shadow-xl w-full sm:w-xl mx-2 border border-gray-200"
        onClick={(e) => e.stopPropagation()} // evita cierre al click dentro del modal
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b px-6 py-3">
          <h2 className="text-xl font-semibold">Añadir Miembro</h2>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-4">
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

          {/* Footer: Botones */}
          <div className="border-t mt-6 pt-4 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
