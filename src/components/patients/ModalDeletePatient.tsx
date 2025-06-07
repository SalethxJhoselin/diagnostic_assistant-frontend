import { Button } from "@/components/ui/button";
import BaseModal from "@/components/ui/BaseModal";
import { toast } from "sonner";
import {
  fetchDeletePatient,
  fetchPatientsByOrg,
  type GetPatient,
} from "@/services/patients.services";
import { useOrganization } from "@/hooks/organizationContex";

interface ModalDeletePatientProps {
  isOpen: boolean;
  onClose: () => void;
  patient: GetPatient | null;
  setPatients: (p: GetPatient[]) => void;
  setFilteredPatients: (p: GetPatient[]) => void;
}

export default function ModalDeletePatient({
  isOpen,
  onClose,
  patient,
  setPatients,
  setFilteredPatients,
}: ModalDeletePatientProps) {
  const { organization } = useOrganization();

  const handleDelete = async () => {
    if (!patient || !organization) return;

    try {
      await fetchDeletePatient(patient.id);
      toast.success("Paciente eliminado correctamente");

      const updated = await fetchPatientsByOrg(organization.id);
      setPatients(updated);
      setFilteredPatients(updated);
      onClose();
    } catch (err) {
      console.error("Error eliminando paciente", err);
      toast.error("Error al eliminar paciente");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      }
    >
      <p>
        ¿Estás seguro de que deseas eliminar al paciente{" "}
        <strong>{patient?.name} {patient?.aPaternal} {patient?.aMaternal}</strong>?
      </p>
    </BaseModal>
  );
}
