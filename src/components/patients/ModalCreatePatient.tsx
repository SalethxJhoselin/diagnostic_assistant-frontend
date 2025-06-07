import { useState } from "react";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/ui/BaseModal";
import { useOrganization } from "@/hooks/organizationContex";
import { toast } from "sonner";
import {
  type CreatePatient,
  type GetPatient,
  fetchPatientsByOrg,
  fetchCreatePatient
} from "@/services/patients.services";

interface ModalCreatePatientProps {
  isOpen: boolean;
  onClose: () => void;
  setPatients: (p: GetPatient[]) => void;
  setFilteredPatients: (p: GetPatient[]) => void;
}

export default function ModalCreatePatient({
  isOpen,
  onClose,
  setPatients,
  setFilteredPatients
}: ModalCreatePatientProps) {
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    aPaternal: "",
    aMaternal: "",
    sexo: "female", // Valor por defecto válido
    birthDate: "",
    phone: "",
    email: "",
    ci: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!organization) {
      toast.error("Organización no detectada");
      return;
    }

    const { name, aPaternal, aMaternal, sexo, birthDate, phone, email, ci } = form;

    if (!name || !aPaternal || !aMaternal || !birthDate || !phone || !email || !ci || !sexo) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const newPatient: CreatePatient = {
        name,
        aPaternal,
        aMaternal,
        sexo,
        birthDate: new Date(birthDate).toISOString(),
        phone: parseInt(phone),
        email,
        ci: parseInt(ci),
        organizationId: organization.id,
      };

      console.log("Payload enviado:", newPatient); // DEBUG

      await fetchCreatePatient(newPatient);
      toast.success("Paciente creado correctamente");

      const updated = await fetchPatientsByOrg(organization.id);
      setPatients(updated);
      setFilteredPatients(updated);

      setForm({
        name: "",
        aPaternal: "",
        aMaternal: "",
        sexo: "female",
        birthDate: "",
        phone: "",
        email: "",
        ci: "",
      });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error creando paciente", err);
      toast.error("Error al crear paciente");
    } finally {
      setLoading(false);
    }
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button onClick={handleSave} disabled={loading}>
        Guardar Paciente
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Paciente"
      footer={modalFooter}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="font-semibold">Nombre</label>
            <input
              id="name"
              name="name"
              className="w-full px-2 py-1 border rounded-md"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Juan"
            />
          </div>
          <div>
            <label htmlFor="aPaternal" className="font-semibold">Apellido Paterno</label>
            <input
              id="aPaternal"
              name="aPaternal"
              className="w-full px-2 py-1 border rounded-md"
              value={form.aPaternal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="aMaternal" className="font-semibold">Apellido Materno</label>
            <input
              id="aMaternal"
              name="aMaternal"
              className="w-full px-2 py-1 border rounded-md"
              value={form.aMaternal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ci" className="font-semibold">CI</label>
            <input
              id="ci"
              name="ci"
              type="number"
              className="w-full px-2 py-1 border rounded-md"
              value={form.ci}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="font-semibold">Teléfono</label>
            <input
              id="phone"
              name="phone"
              className="w-full px-2 py-1 border rounded-md"
              value={form.phone}
              onChange={handleChange}
              placeholder="Ej: 71234567"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-semibold">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-2 py-1 border rounded-md"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="font-semibold">Fecha de Nacimiento</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full px-2 py-1 border rounded-md"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="sexo" className="font-semibold">Sexo</label>
            <select
              id="sexo"
              name="sexo"
              className="w-full px-2 py-1 border rounded-md"
              value={form.sexo}
              onChange={handleChange}
            >
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
            </select>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
