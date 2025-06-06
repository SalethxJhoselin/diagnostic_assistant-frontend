import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";

import {
  fetchMembersByOrganization,
  fetchRemoveMember,
  type OrganizationMember,
} from "@/services/organizations-members";

import AddMemberModal from "@/components/AddMemberModal"; // ajusta ruta si es necesario
import { IconSearch } from "@/assets/icons";
import ModalConfirmation from "@/components/ModalConfirmation";
import type { Organization } from "@/lib/interfaces";

export default function TeamOrganization() {
  const { organization } = useOrganization();

  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<OrganizationMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  
  const canAddMember = (organization: Organization, currentMemberCount: number): boolean => {
    if (!organization || !organization.subscriptions) return false;

    // Buscar la suscripción activa
    const activeSubscription = organization.subscriptions.find(sub => sub.isActive);
    if (!activeSubscription) return false;

    // Obtener el límite de miembros desde el plan
    const limit = activeSubscription.plan.limitMembers;

    // Verificar si el número de miembros es menor que el límite
    return currentMemberCount < limit;
    };

     const openAddMemberModal = () => {
    if (!organization) {
      toast.error("No se ha encontrado la organización.");
      return;
    }

    // Validamos si se puede añadir el miembro
    if (!canAddMember(organization, members.length)) {
      toast.error("Has alcanzado el límite de miembros para tu plan.");
      return;
    }

    // Si pasa la validación, abrimos el modal
    setIsAddModalOpen(true);
  };

  const fetchMembers = async () => {
    if (!organization) return;
    setIsLoading(true);
    try {
      const data = await fetchMembersByOrganization(organization.id);
      setMembers(data);
      setFilteredMembers(data);
      setSelectedIds([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Error cargando miembros de la organización");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [organization]);

  useEffect(() => {
    const filtered = members.filter(
      (m) =>
        m.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())

    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [searchQuery, members]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
   const openConfirmDelete = () => {
    if (selectedIds.length === 0) return;
        setIsConfirmOpen(true);
    };
    
  const handleDelete = async () => {
     setIsConfirmOpen(false);

    const promise = Promise.all(selectedIds.map((id) => fetchRemoveMember(id)));

    toast.promise(promise, {
      loading: "Eliminando miembros...",
      success: "Miembros eliminados correctamente",
      error: "Error al eliminar miembros",
    });

    try {
      await promise;
      await fetchMembers();
    } catch (error) {
      console.error("Error eliminando miembros:", error);
    }
  };

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
   <div className="w-full flex flex-col px-6 py-8 relative">
    <h1 className="text-2xl font-semibold mb-6">Miembros de la Organización</h1>

    <section className="mb-8">
      <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4 items-center">
        <Button
          onClick={openAddMemberModal}
          className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left whitespace-nowrap"
        >
          Añadir Miembro
        </Button>

        <div className="relative w-full max-w-sm flex items-center group">
          <div className="absolute pl-4 pointer-events-none text-zinc-600">
            <IconSearch />                       
          </div>
          <input
            type="search"
            placeholder="Buscar por userId o rol..."
            className="w-full sm:w-80 border rounded-lg pl-12 py-1 bg-[var(--input-soft)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedIds.length > 0 && (
          <Button
             onClick={openConfirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 cursor-pointer animate-fade-in-left whitespace-nowrap"
          >
            Eliminar {selectedIds.length} Miembro(s)
          </Button>
        )}
      </div>
    </section>

      <div className="w-full overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-secondary border-b">
            <tr>
              <th className="w-[40px] text-center px-4 py-2 border-r">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === filteredMembers.length && filteredMembers.length > 0
                  }
                  onChange={() =>
                    selectedIds.length === filteredMembers.length
                      ? setSelectedIds([])
                      : setSelectedIds(filteredMembers.map((m) => m.id))
                  }
                />
              </th>
              <th className="text-left px-4 py-2 border-r">ID Miembro</th>
              <th className="text-left px-4 py-2 border-r">Email</th>
              <th className="text-left px-4 py-2 border-r">ID Usuario</th>
              <th className="text-left px-4 py-2 border-r">Rol</th>
              <th className="text-left px-4 py-2 border-r">ID Organización</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
            ) : paginatedMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No se encontraron miembros.
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="text-center px-4 py-2 border-r">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => toggleSelect(member.id)}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">{member.id}</td>
                  <td className="px-4 py-2 border-r">{member.user?.email ?? "No disponible"}</td>
                  <td className="px-4 py-2 border-r">{member.userId}</td>
                  <td className="px-4 py-2 border-r">{member.role}</td>
                  <td className="px-4 py-2 border-r">{member.organizationId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      )}

      {isAddModalOpen && organization && (
        <AddMemberModal
          isOpen={isAddModalOpen}
          organizationId={organization.id}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={fetchMembers}
        />
      )}
       <ModalConfirmation
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Eliminar ${selectedIds.length} Miembro(s)`}
        message={`¿Estás seguro de eliminar ${selectedIds.length} miembro(s)? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
