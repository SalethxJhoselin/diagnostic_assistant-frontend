import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useOrganization } from "@/hooks/organizationContex";
import { toast } from "sonner";
import {
  type GetPatient,
  fetchPatientsByOrg,
} from "@/services/patients.services";
import ModalCreatePatient from "@/components/patients/ModalCreatePatient";
import ModalEditPatient from "@/components/patients/ModalEditPatient";
import ModalDeletePatient from "@/components/patients/ModalDeletePatient";
import { IconSearch } from "@/assets/icons";

export default function Patients() {
  const { organization } = useOrganization();
  const [patients, setPatients] = useState<GetPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<GetPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [editPatient, setEditPatient] = useState<GetPatient | null>(null);
  const [deletePatient, setDeletePatient] = useState<GetPatient | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      if (!organization) return;
      setIsLoading(true);
      try {
        const data = await fetchPatientsByOrg(organization.id);
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        toast.error("Error al cargar pacientes");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPatients();
  }, [organization]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        `${p.name} ${p.aPaternal} ${p.aMaternal}`.toLowerCase().includes(query) ||
        p.ci.toString().includes(query) ||
        p.email.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  return (
    <div className="w-full flex flex-col sm:px-20 px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl mb-4 font-semibold">Pacientes</h1>
        <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
          <Button
            className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left flex items-center gap-2"
            onClick={() => setOpenModalCreate(true)}
          >
            <PlusCircle size={18} />
            Nuevo Paciente
          </Button>

          <div className="flex items-center relative group">
            <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
             <IconSearch />
            </div>
            <input
              className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
              type="search"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="w-full overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-secondary border-b text-left text-sm">
            <tr>
              <th className="px-4 py-2 border-r">Nombre completo</th>
              <th className="px-4 py-2 border-r">CI</th>
              <th className="px-4 py-2 border-r">Sexo</th>
              <th className="px-4 py-2 border-r">Nacimiento</th>
              <th className="px-4 py-2 border-r">Correo</th>
              <th className="px-4 py-2 border-r">Teléfono</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Cargando...
                </td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No se encontraron pacientes
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => (
                <tr key={p.id} className="group text-[14px] border-t hover:bg-gray-900 transition-all animate-fade-in-up">
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors">
                    {`${p.name} ${p.aPaternal} ${p.aMaternal}`}
                  </td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors">{p.ci}</td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors">
                    {p.sexo === "F" ? "Femenino" : "Masculino"}
                  </td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors">
                    {new Date(p.birthDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors">{p.email}</td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors">{p.phone}</td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400 transition-colors flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => setEditPatient(p)}
                    >
                      <Pencil size={14} />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1"
                      onClick={() => setDeletePatient(p)}
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal crear */}
      {openModalCreate && (
        <ModalCreatePatient
          isOpen={openModalCreate}
          onClose={() => setOpenModalCreate(false)}
          setPatients={setPatients}
          setFilteredPatients={setFilteredPatients}
        />
      )}

      {/* Modal editar */}
      {editPatient && (
        <ModalEditPatient
          isOpen={!!editPatient}
          onClose={() => setEditPatient(null)}
          patient={editPatient}
          setPatients={setPatients}
          setFilteredPatients={setFilteredPatients}
        />
      )}

      {/* Modal eliminar */}
      {deletePatient && (
        <ModalDeletePatient
          isOpen={!!deletePatient}
          onClose={() => setDeletePatient(null)}
          patient={deletePatient}
          setPatients={setPatients}
          setFilteredPatients={setFilteredPatients}
        />
      )}
    </div>
  );
}
